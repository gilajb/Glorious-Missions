import uuid

from django.db import models


def generate_reference():
    """An unguessable Paystack transaction reference."""
    return f"gm-{uuid.uuid4().hex}"


class Donation(models.Model):
    """A gift started through the public giving form and paid via Paystack.

    A row is created as `pending` before the donor is sent to Paystack, then
    settled by whichever arrives first: the donor returning to the site (the
    verify endpoint) or Paystack's webhook.
    """

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        SUCCESS = "success", "Success"
        FAILED = "failed", "Failed"
        ABANDONED = "abandoned", "Abandoned"

    reference = models.CharField(
        max_length=64, unique=True, default=generate_reference, editable=False
    )
    name = models.CharField(max_length=150, blank=True)
    email = models.EmailField()
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3)
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.PENDING
    )
    # How the donor paid (card, mobile_money, ...), as reported by Paystack.
    channel = models.CharField(max_length=50, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.currency} {self.amount} from {self.email} ({self.status})"

    @property
    def amount_subunits(self):
        """The amount in the currency's subunit (cents, kobo), as Paystack expects."""
        return int(self.amount * 100)
