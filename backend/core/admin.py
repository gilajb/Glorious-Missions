from django.contrib import admin

from core.admin_mixins import CloudinaryPreviewMixin
from core.models import SiteContent, TeamMember, Testimonial


@admin.register(SiteContent)
class SiteContentAdmin(CloudinaryPreviewMixin, admin.ModelAdmin):
    list_display = ["title", "section", "published", "image_preview", "updated_at"]
    list_filter = ["section", "published"]
    list_editable = ["published"]
    search_fields = ["title", "body"]
    readonly_fields = ["image_preview", "updated_at"]
    fields = ["section", "title", "body", "image", "image_preview", "published", "updated_at"]


@admin.register(TeamMember)
class TeamMemberAdmin(CloudinaryPreviewMixin, admin.ModelAdmin):
    list_display = ["name", "role", "published", "image_preview", "display_order"]
    list_filter = ["published"]
    list_editable = ["display_order", "published"]
    search_fields = ["name", "role", "bio", "location"]
    readonly_fields = ["image_preview"]
    fields = [
        "name",
        "role",
        "bio",
        "location",
        "image",
        "image_preview",
        "display_order",
        "published",
    ]


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ["author_name", "author_role", "published", "created_at"]
    list_filter = ["published"]
    list_editable = ["published"]
    search_fields = ["author_name", "author_role", "quote"]
    readonly_fields = ["created_at"]
