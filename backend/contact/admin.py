from django.contrib import admin

from contact.models import ContactSubmission


@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    list_display = ["name", "email", "involvement_interest", "submitted_at"]
    list_filter = ["submitted_at", "involvement_interest"]
    search_fields = ["name", "email", "message"]
    date_hierarchy = "submitted_at"
    readonly_fields = ["name", "email", "message", "involvement_interest", "submitted_at"]

    def has_add_permission(self, request):
        # Submissions arrive through the public API, not the admin.
        return False

    def has_change_permission(self, request, obj=None):
        return False
