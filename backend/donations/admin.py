from django.contrib import admin

from donations.models import Donation


@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    list_display = ["reference", "name", "email", "amount", "currency", "status", "paid_at", "created_at"]
    list_filter = ["status", "currency", "created_at"]
    search_fields = ["reference", "name", "email"]
    date_hierarchy = "created_at"
    readonly_fields = [
        "reference",
        "name",
        "email",
        "amount",
        "currency",
        "status",
        "channel",
        "paid_at",
        "created_at",
    ]

    def has_add_permission(self, request):
        # Donations arrive through the public API and Paystack, not the admin.
        return False

    def has_change_permission(self, request, obj=None):
        return False
