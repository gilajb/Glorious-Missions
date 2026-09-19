from cloudinary.models import CloudinaryField
from django.db import models
from django.utils import timezone

from core.validators import validate_video_url


class Mission(models.Model):
    """A weekly "Mission Monday" post about an outreach/site, tied to a county.

    Internal naming (model/app/table) stays "Mission" even though the public
    site presents this feature as "Mission Mondays" -- that's a display-only
    rename, not a backend one.
    """

    title = models.CharField(max_length=200)
    # Short plain-text teaser shown on cards/previews.
    summary = models.TextField(blank=True)
    # Full post body. Sanitized HTML from the admin's rich text editor -- see
    # missions/admin_serializers.py::MissionAdminSerializer.validate_article.
    article = models.TextField(blank=True, default="")
    county = models.CharField(max_length=100, default="")
    # Blank end_date means the mission is ongoing; no separate status field needed.
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    # Deprecated: the original single-image field, kept only so existing rows
    # and any lingering readers keep working. New content uses `photos`
    # (see MissionPhoto below). Do not use this for new features.
    image = CloudinaryField("image", blank=True, null=True)
    video_url = models.URLField(blank=True, default="", validators=[validate_video_url])
    # The Monday this post is about/for -- distinct from created_at/updated_at
    # (pure audit timestamps) so a post can be backdated or ordered
    # independently of when it happened to be saved.
    publish_date = models.DateField(default=timezone.localdate)
    published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-publish_date", "-created_at"]

    def __str__(self):
        return self.title


class MissionPhoto(models.Model):
    """One photo in a Mission Monday post's gallery, in display order."""

    mission = models.ForeignKey(Mission, related_name="photos", on_delete=models.CASCADE)
    image = CloudinaryField("image")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"Photo #{self.pk} for {self.mission_id}"
