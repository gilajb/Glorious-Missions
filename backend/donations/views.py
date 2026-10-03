import json
import logging
import re
from urllib.parse import urlsplit

from django.conf import settings
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from donations import paystack
from donations.models import Donation
from donations.serializers import DonationCreateSerializer, DonationStatusSerializer
from donations.services import record_paystack_result

logger = logging.getLogger(__name__)


def _is_frontend_url(url):
    """True if `url` points at one of the frontend origins CORS already trusts.

    Paystack redirects the donor to callback_url after checkout, so an
    arbitrary value would let anyone bounce donors from a genuine checkout
    to a site of their choosing.
    """
    parts = urlsplit(url)
    origin = f"{parts.scheme}://{parts.netloc}"
    return origin in settings.CORS_ALLOWED_ORIGINS or any(
        re.match(pattern, origin) for pattern in settings.CORS_ALLOWED_ORIGIN_REGEXES
    )


class DonationConfigView(APIView):
    """Tells the frontend whether to show the giving form, and in what currency."""

    def get(self, request):
        return Response(
            {
                "enabled": bool(settings.PAYSTACK_SECRET_KEY),
                "currency": settings.DONATION_CURRENCY,
            }
        )


class DonationCreateView(APIView):
    """Records a pending donation and returns the Paystack checkout URL for it."""

    # Rate limited per settings.REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"]["donate"].
    throttle_scope = "donate"

    def post(self, request):
        if not settings.PAYSTACK_SECRET_KEY:
            return Response(
                {"detail": "Online giving is not available yet."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        serializer = DonationCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        callback_url = data.get("callback_url") or None
        if callback_url and not _is_frontend_url(callback_url):
            # Fall back to the callback URL set in the Paystack dashboard.
            logger.warning("Ignoring untrusted donation callback_url %s", callback_url)
            callback_url = None

        donation = Donation.objects.create(
            name=data.get("name", ""),
            email=data["email"],
            amount=data["amount"],
            currency=settings.DONATION_CURRENCY,
        )

        try:
            transaction = paystack.initialize_transaction(
                email=donation.email,
                amount_subunits=donation.amount_subunits,
                currency=donation.currency,
                reference=donation.reference,
                callback_url=callback_url,
            )
        except paystack.PaystackError:
            logger.exception("Could not initialize Paystack transaction %s", donation.reference)
            donation.status = Donation.Status.FAILED
            donation.save(update_fields=["status"])
            return Response(
                {"detail": "We could not start the payment. Please try again shortly."},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        return Response(
            {
                "reference": donation.reference,
                "authorization_url": transaction["authorization_url"],
            },
            status=status.HTTP_201_CREATED,
        )


class DonationVerifyView(APIView):
    """Confirms a donation with Paystack when the donor lands back on the site."""

    throttle_scope = "donate_verify"

    def get(self, request, reference):
        donation = get_object_or_404(Donation, reference=reference)

        if donation.status != Donation.Status.SUCCESS and settings.PAYSTACK_SECRET_KEY:
            try:
                record_paystack_result(donation, paystack.verify_transaction(reference))
            except paystack.PaystackError:
                # Report the status we have; the webhook will settle it later.
                logger.exception("Could not verify Paystack transaction %s", reference)

        return Response(DonationStatusSerializer(donation).data)


@csrf_exempt
@require_POST
def paystack_webhook(request):
    """Paystack's server-to-server notification.

    This is what settles a donation when the donor pays but never makes it
    back to the site (closed tab, lost connection). A plain Django view
    rather than a DRF one because the signature covers the raw request body.
    Paystack retries until it gets a 200.
    """
    signature = request.headers.get("x-paystack-signature", "")
    if not settings.PAYSTACK_SECRET_KEY or not paystack.is_valid_signature(
        request.body, signature
    ):
        return HttpResponse(status=401)

    try:
        event = json.loads(request.body)
    except ValueError:
        return HttpResponse(status=400)

    if isinstance(event, dict) and event.get("event") == "charge.success":
        data = event.get("data") or {}
        donation = Donation.objects.filter(reference=data.get("reference")).first()
        if donation:
            record_paystack_result(donation, data)

    return HttpResponse(status=200)
