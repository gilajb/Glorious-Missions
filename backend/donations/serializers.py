from decimal import Decimal

from rest_framework import serializers

from donations.models import Donation


class DonationCreateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    email = serializers.EmailField()
    amount = serializers.DecimalField(
        max_digits=12, decimal_places=2, min_value=Decimal("1")
    )
    # Where Paystack sends the donor back to after checkout.
    callback_url = serializers.URLField(required=False, allow_blank=True)


class DonationStatusSerializer(serializers.ModelSerializer):
    """Deliberately excludes name/email: anyone holding the reference can read this."""

    class Meta:
        model = Donation
        fields = ["reference", "status", "amount", "currency"]
