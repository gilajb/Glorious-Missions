from django.contrib import admin

from involvement.models import GetInvolvedLink, GetInvolvedSubmission


@admin.register(GetInvolvedLink)
class GetInvolvedLinkAdmin(admin.ModelAdmin):
    list_display = ["title", "link_type", "url", "display_order"]
    list_filter = ["link_type"]
    list_editable = ["display_order"]
    search_fields = ["title", "description", "url"]
    ordering = ["display_order", "id"]


@admin.register(GetInvolvedSubmission)
class GetInvolvedSubmissionAdmin(admin.ModelAdmin):
    list_display = ["name", "email", "submitted_at"]
    list_filter = ["submitted_at"]
    search_fields = ["name", "email", "message"]
    date_hierarchy = "submitted_at"
    readonly_fields = ["name", "email", "message", "submitted_at"]

    def has_add_permission(self, request):
        # Submissions arrive through the public API, not the admin.
        return False

    def has_change_permission(self, request, obj=None):
        return False
