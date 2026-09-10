"""Shared admin helpers for Cloudinary-backed image fields."""

from django.contrib import admin
from django.utils.html import format_html


class CloudinaryPreviewMixin:
    """Adds an ``image_preview`` thumbnail rendered by Cloudinary.

    Use it in ``list_display`` and/or ``readonly_fields``. The thumbnail is a
    Cloudinary transformation URL, so no full-size image is downloaded.
    """

    #: Name of the CloudinaryField on the model.
    preview_field_name = "image"

    @admin.display(description="Preview")
    def image_preview(self, obj):
        resource = getattr(obj, self.preview_field_name, None)
        if not resource:
            return "—"
        try:
            url = resource.build_url(
                width=160, height=160, crop="fill", quality="auto", secure=True
            )
        except Exception:  # pragma: no cover - malformed/legacy value
            return "—"
        return format_html(
            '<img src="{}" width="80" height="80" '
            'style="object-fit:cover;border-radius:4px;" />',
            url,
        )
