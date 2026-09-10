from cloudinary.models import CloudinaryField
from django.db import models


class GalleryImage(models.Model):
    """A photograph shown in the public gallery."""

    image = CloudinaryField("image")
    caption = models.CharField(max_length=255, blank=True)
    # Optional, unlike Mission.county: not every photo is tied to one place
    # (e.g. a portrait or an office event), so it's left blank rather than
    # required.
    county = models.CharField(max_length=100, blank=True, default="")
    published = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-uploaded_at"]

    def __str__(self):
        return self.caption or f"Gallery image #{self.pk}"
