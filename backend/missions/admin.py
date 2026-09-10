from django.contrib import admin

from core.admin_mixins import CloudinaryPreviewMixin
from missions.models import Mission


@admin.register(Mission)
class MissionAdmin(CloudinaryPreviewMixin, admin.ModelAdmin):
    list_display = [
        "title",
        "county",
        "start_date",
        "end_date",
        "published",
        "image_preview",
        "created_at",
    ]
    list_filter = ["published", "county", "created_at"]
    list_editable = ["published"]
    search_fields = ["title", "summary", "county"]
    date_hierarchy = "created_at"
    readonly_fields = ["image_preview", "created_at", "updated_at"]
    fields = [
        "title",
        "summary",
        "county",
        "start_date",
        "end_date",
        "image",
        "image_preview",
        "published",
        "created_at",
        "updated_at",
    ]
