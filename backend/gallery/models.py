from cloudinary.models import CloudinaryField
from django.db import models


class GalleryImage(models.Model):
    """An entry shown in the public gallery: one or more photos, tagged with a
    category -- the gallery is otherwise a pure photo collection (see
    MissionPhoto's sibling `Mission` model for a content type with
    captions/video/article)."""

    class Category(models.TextChoices):
        MISSIONS = "missions", "Missions"
        PEOPLE = "people", "People"
        PLACES = "places", "Places"
        STORIES = "stories", "Stories"
        DOCUMENTARIES = "documentaries", "Documentaries"

    # Deprecated: the original single-image field, kept only so existing rows
    # and any lingering readers keep working. New content uses `photos`
    # (see GalleryPhoto below). Do not use this for new features.
    image = CloudinaryField("image")
    category = models.CharField(
        max_length=20, choices=Category.choices, default=Category.STORIES
    )
    published = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-uploaded_at"]

    def __str__(self):
        return f"Gallery image #{self.pk}"


class GalleryPhoto(models.Model):
    """One photo in a gallery entry's set, in display order."""

    gallery_image = models.ForeignKey(
        GalleryImage, related_name="photos", on_delete=models.CASCADE
    )
    image = CloudinaryField("image")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"Photo #{self.pk} for {self.gallery_image_id}"
