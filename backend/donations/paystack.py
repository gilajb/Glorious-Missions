"""Minimal Paystack client: only the calls the donation flow needs.

Docs: https://paystack.com/docs/api/transaction/
"""

import hashlib
import hmac

import requests
from django.conf import settings

API_BASE_URL = "https://api.paystack.co"
TIMEOUT_SECONDS = 15


class PaystackError(Exception):
    """Paystack was unreachable or rejected the request."""


def _request(method, path, **kwargs):
    try:
        response = requests.request(
            method,
            f"{API_BASE_URL}{path}",
            headers={"Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}"},
            timeout=TIMEOUT_SECONDS,
            **kwargs,
        )
        payload = response.json()
    except (requests.RequestException, ValueError) as exc:
        raise PaystackError(str(exc)) from exc

    if not isinstance(payload, dict):
        raise PaystackError(f"Unexpected response (HTTP {response.status_code})")
    if not response.ok or not payload.get("status"):
        raise PaystackError(payload.get("message") or f"HTTP {response.status_code}")
    return payload.get("data") or {}


def initialize_transaction(*, email, amount_subunits, currency, reference, callback_url=None):
    """Start a transaction; the returned dict carries `authorization_url`."""
    body = {
        "email": email,
        "amount": amount_subunits,
        "currency": currency,
        "reference": reference,
    }
    if callback_url:
        body["callback_url"] = callback_url
    return _request("POST", "/transaction/initialize", json=body)


def verify_transaction(reference):
    """Fetch a transaction's current state (`status`, `amount`, `currency`, ...)."""
    return _request("GET", f"/transaction/verify/{reference}")


def is_valid_signature(body, signature):
    """Check a webhook's x-paystack-signature: HMAC-SHA512 of the raw body."""
    expected = hmac.new(
        settings.PAYSTACK_SECRET_KEY.encode(), body, hashlib.sha512
    ).hexdigest()
    return hmac.compare_digest(expected, signature or "")
