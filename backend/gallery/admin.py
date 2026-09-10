from django.contrib import admin

from core.admin_mixins import CloudinaryPreviewMixin
from gallery.models import GalleryImage


@admin.register(GalleryImage)
class GalleryImageAdmin(CloudinaryPreviewMixin, admin.ModelAdmin):
    list_display = ["__str__", "county", "image_preview", "published", "uploaded_at"]
    list_filter = ["published", "county", "uploaded_at"]
    list_editable = ["published"]
    search_fields = ["caption", "county"]
    date_hierarchy = "uploaded_at"
    readonly_fields = ["image_preview", "uploaded_at"]
    fields = ["image", "image_preview", "caption", "county", "published", "uploaded_at"]
