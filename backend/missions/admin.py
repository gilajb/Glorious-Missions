from django.contrib import admin

from core.admin_mixins import CloudinaryPreviewMixin
from missions.models import Mission, MissionPhoto


class MissionPhotoInline(CloudinaryPreviewMixin, admin.TabularInline):
    model = MissionPhoto
    extra = 1
    fields = ["image", "image_preview", "order"]
    readonly_fields = ["image_preview"]


@admin.register(Mission)
class MissionAdmin(CloudinaryPreviewMixin, admin.ModelAdmin):
    list_display = [
        "title",
        "county",
        "publish_date",
        "start_date",
        "end_date",
        "published",
        "image_preview",
        "created_at",
    ]
    list_filter = ["published", "county", "publish_date"]
    list_editable = ["published"]
    search_fields = ["title", "summary", "article", "county"]
    date_hierarchy = "publish_date"
    readonly_fields = ["image_preview", "created_at", "updated_at"]
    inlines = [MissionPhotoInline]
    fields = [
        "title",
        "summary",
        "article",
        "county",
        "start_date",
        "end_date",
        "image",
        "image_preview",
        "video_url",
        "publish_date",
        "published",
        "created_at",
        "updated_at",
    ]
