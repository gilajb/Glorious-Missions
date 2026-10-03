import logging

from django.utils import timezone
from django.utils.dateparse import parse_datetime

from core.notifications import notify_new_donation
from donations.models import Donation

logger = logging.getLogger(__name__)

# Paystack statuses that settle a transaction without payment. Anything else
# that isn't "success" (ongoing, pending, processing, queued) is still in
# flight, so the donation stays pending.
_UNPAID_STATUSES = {
    "failed": Donation.Status.FAILED,
    "abandoned": Donation.Status.ABANDONED,
}


def record_paystack_result(donation, data):
    """Update a donation from a Paystack transaction object.

    `data` is the `data` dict of either a verify response or a charge.success
    webhook -- both have the same shape. Safe to call repeatedly and from both
    paths at once: a donation is only marked successful (and notified) once,
    and a successful donation is never downgraded.
    """
    status = data.get("status")

    if status != "success":
        new_status = _UNPAID_STATUSES.get(status)
        if new_status:
            Donation.objects.filter(pk=donation.pk).exclude(
                status=Donation.Status.SUCCESS
            ).update(status=new_status)
            donation.refresh_from_db()
        return donation

    # Never trust the reference alone: the paid amount and currency must
    # match what this donation was created for.
    if (
        data.get("amount") != donation.amount_subunits
        or data.get("currency") != donation.currency
    ):
        logger.error(
            "Paystack result for %s does not match the donation: got %s %s, expected %s %s",
            donation.reference,
            data.get("amount"),
            data.get("currency"),
            donation.amount_subunits,
            donation.currency,
        )
        return donation

    paid_at = parse_datetime(data.get("paid_at") or "") or timezone.now()
    # A conditional UPDATE, so the verify endpoint and the webhook racing
    # each other can't both see "newly successful" and send two emails.
    newly_paid = (
        Donation.objects.filter(pk=donation.pk)
        .exclude(status=Donation.Status.SUCCESS)
        .update(
            status=Donation.Status.SUCCESS,
            paid_at=paid_at,
            channel=(data.get("channel") or "")[:50],
        )
    )
    donation.refresh_from_db()
    if newly_paid:
        notify_new_donation(donation)
    return donation
