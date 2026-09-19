from django.contrib import admin

from core.admin_mixins import CloudinaryPreviewMixin
from gallery.models import GalleryImage, GalleryPhoto


class GalleryPhotoInline(CloudinaryPreviewMixin, admin.TabularInline):
    model = GalleryPhoto
    extra = 1
    fields = ["image", "image_preview", "order"]
    readonly_fields = ["image_preview"]


@admin.register(GalleryImage)
class GalleryImageAdmin(CloudinaryPreviewMixin, admin.ModelAdmin):
    list_display = ["__str__", "image_preview", "published", "uploaded_at"]
    list_filter = ["published", "uploaded_at"]
    list_editable = ["published"]
    date_hierarchy = "uploaded_at"
    readonly_fields = ["image_preview", "uploaded_at"]
    inlines = [GalleryPhotoInline]
    fields = ["image", "image_preview", "published", "uploaded_at"]
