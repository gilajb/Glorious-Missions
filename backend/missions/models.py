from cloudinary.models import CloudinaryField
from django.db import models


class Mission(models.Model):
    """A single missionary outreach/site the organisation runs, tied to a county."""

    title = models.CharField(max_length=200)
    summary = models.TextField(blank=True)
    county = models.CharField(max_length=100, default="")
    # Blank end_date means the mission is ongoing; no separate status field needed.
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    image = CloudinaryField("image", blank=True, null=True)
    published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title
