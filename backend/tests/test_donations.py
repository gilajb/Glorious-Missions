"""Tests for the Paystack giving flow.

Paystack itself is never called: `donations.paystack.requests.request` is
mocked, so these cover our handling of its responses and webhooks.
"""

import hashlib
import hmac
import json
from decimal import Decimal
from unittest import mock

import requests
from django.core import mail
from django.core.cache import cache
from django.test import TestCase, override_settings
from django.urls import reverse

from donations.models import Donation

SECRET = "sk_test_secret"


def _paystack_response(data, ok=True, message=""):
    response = mock.Mock()
    response.ok = ok
    response.status_code = 200 if ok else 400
    response.json.return_value = {"status": ok, "message": message, "data": data}
    return response


def _signed(payload):
    body = json.dumps(payload).encode()
    signature = hmac.new(SECRET.encode(), body, hashlib.sha512).hexdigest()
    return body, signature


@override_settings(
    PAYSTACK_SECRET_KEY=SECRET,
    DONATION_CURRENCY="KES",
    CORS_ALLOWED_ORIGINS=["https://site.test"],
    CORS_ALLOWED_ORIGIN_REGEXES=[],
    NOTIFY_EMAIL="inbox@example.test",
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
)
class DonationFlowTests(TestCase):
    payload = {"name": "Ada", "email": "ada@example.test", "amount": "1500"}

    def setUp(self):
        mail.outbox.clear()
        cache.clear()

    def _create(self, **overrides):
        return self.client.post(
            reverse("donations:donation-create"),
            {**self.payload, **overrides},
            content_type="application/json",
        )

    def _donation(self, **overrides):
        fields = {"email": "ada@example.test", "amount": Decimal("1500"), "currency": "KES"}
        return Donation.objects.create(**{**fields, **overrides})

    def _paid(self, donation, **overrides):
        return {
            "reference": donation.reference,
            "status": "success",
            "amount": 150000,
            "currency": "KES",
            "channel": "mobile_money",
            "paid_at": "2026-10-05T09:30:00.000Z",
            **overrides,
        }

    def test_config_reports_enabled_and_currency(self):
        response = self.client.get(reverse("donations:donation-config"))

        self.assertEqual(response.json(), {"enabled": True, "currency": "KES"})

    @override_settings(PAYSTACK_SECRET_KEY="")
    def test_giving_is_disabled_without_a_secret_key(self):
        self.assertFalse(
            self.client.get(reverse("donations:donation-config")).json()["enabled"]
        )
        self.assertEqual(self._create().status_code, 503)
        self.assertEqual(Donation.objects.count(), 0)

    @mock.patch("donations.paystack.requests.request")
    def test_create_stores_a_pending_donation_and_returns_the_checkout_url(self, request):
        request.return_value = _paystack_response(
            {"authorization_url": "https://checkout.paystack.com/abc"}
        )

        response = self._create(callback_url="https://site.test/get-involved")

        self.assertEqual(response.status_code, 201, response.content)
        donation = Donation.objects.get()
        self.assertEqual(donation.status, Donation.Status.PENDING)
        self.assertEqual(
            response.json(),
            {
                "reference": donation.reference,
                "authorization_url": "https://checkout.paystack.com/abc",
            },
        )
        sent = request.call_args.kwargs["json"]
        # Paystack takes the amount in subunits.
        self.assertEqual(sent["amount"], 150000)
        self.assertEqual(sent["currency"], "KES")
        self.assertEqual(sent["reference"], donation.reference)
        self.assertEqual(sent["callback_url"], "https://site.test/get-involved")
        self.assertEqual(
            request.call_args.kwargs["headers"]["Authorization"], f"Bearer {SECRET}"
        )

    @mock.patch("donations.paystack.requests.request")
    def test_untrusted_callback_url_is_not_forwarded_to_paystack(self, request):
        request.return_value = _paystack_response({"authorization_url": "https://x.test"})

        response = self._create(callback_url="https://evil.test/get-involved")

        self.assertEqual(response.status_code, 201)
        self.assertNotIn("callback_url", request.call_args.kwargs["json"])

    def test_invalid_payload_is_rejected(self):
        response = self._create(email="not-an-email", amount="0")

        self.assertEqual(response.status_code, 400)
        self.assertEqual(set(response.json()), {"email", "amount"})
        self.assertEqual(Donation.objects.count(), 0)

    @mock.patch("donations.paystack.requests.request")
    def test_paystack_failure_returns_502_and_marks_the_donation_failed(self, request):
        request.side_effect = requests.ConnectionError("paystack is down")

        with self.assertLogs("donations.views", level="ERROR"):
            response = self._create()

        self.assertEqual(response.status_code, 502)
        self.assertEqual(Donation.objects.get().status, Donation.Status.FAILED)

    @mock.patch("donations.paystack.requests.request")
    def test_verify_marks_a_paid_donation_successful_and_notifies_once(self, request):
        donation = self._donation()
        request.return_value = _paystack_response(self._paid(donation))
        url = reverse("donations:donation-verify", args=[donation.reference])

        response = self.client.get(url)
        self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "success")
        # No donor details leak to whoever holds the reference.
        self.assertEqual(
            set(response.json()), {"reference", "status", "amount", "currency"}
        )
        donation.refresh_from_db()
        self.assertEqual(donation.channel, "mobile_money")
        self.assertIsNotNone(donation.paid_at)
        self.assertEqual(len(mail.outbox), 1)
        # Already settled, so the second call never went back to Paystack.
        self.assertEqual(request.call_count, 1)

    @mock.patch("donations.paystack.requests.request")
    def test_verify_rejects_a_payment_for_the_wrong_amount(self, request):
        donation = self._donation()
        request.return_value = _paystack_response(self._paid(donation, amount=100))

        with self.assertLogs("donations.services", level="ERROR"):
            response = self.client.get(
                reverse("donations:donation-verify", args=[donation.reference])
            )

        self.assertEqual(response.json()["status"], "pending")
        self.assertEqual(len(mail.outbox), 0)

    @mock.patch("donations.paystack.requests.request")
    def test_verify_records_an_abandoned_checkout(self, request):
        donation = self._donation()
        request.return_value = _paystack_response(
            {"reference": donation.reference, "status": "abandoned"}
        )

        response = self.client.get(
            reverse("donations:donation-verify", args=[donation.reference])
        )

        self.assertEqual(response.json()["status"], "abandoned")

    @mock.patch("donations.paystack.requests.request")
    def test_verify_reports_the_stored_status_when_paystack_is_unreachable(self, request):
        donation = self._donation()
        request.side_effect = requests.Timeout("slow")

        with self.assertLogs("donations.views", level="ERROR"):
            response = self.client.get(
                reverse("donations:donation-verify", args=[donation.reference])
            )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "pending")

    def test_verify_404s_for_an_unknown_reference(self):
        response = self.client.get(reverse("donations:donation-verify", args=["nope"]))

        self.assertEqual(response.status_code, 404)

    def test_webhook_marks_the_donation_successful(self):
        donation = self._donation(status=Donation.Status.ABANDONED)
        body, signature = _signed({"event": "charge.success", "data": self._paid(donation)})

        response = self.client.post(
            reverse("donations:paystack-webhook"),
            body,
            content_type="application/json",
            HTTP_X_PAYSTACK_SIGNATURE=signature,
        )

        self.assertEqual(response.status_code, 200)
        donation.refresh_from_db()
        self.assertEqual(donation.status, Donation.Status.SUCCESS)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn("1,500.00", mail.outbox[0].subject)

    def test_webhook_rejects_a_bad_signature(self):
        donation = self._donation()
        body, _ = _signed({"event": "charge.success", "data": self._paid(donation)})

        response = self.client.post(
            reverse("donations:paystack-webhook"),
            body,
            content_type="application/json",
            HTTP_X_PAYSTACK_SIGNATURE="forged",
        )

        self.assertEqual(response.status_code, 401)
        donation.refresh_from_db()
        self.assertEqual(donation.status, Donation.Status.PENDING)

    def test_webhook_acknowledges_events_it_does_not_handle(self):
        body, signature = _signed({"event": "transfer.success", "data": {}})

        response = self.client.post(
            reverse("donations:paystack-webhook"),
            body,
            content_type="application/json",
            HTTP_X_PAYSTACK_SIGNATURE=signature,
        )

        self.assertEqual(response.status_code, 200)
