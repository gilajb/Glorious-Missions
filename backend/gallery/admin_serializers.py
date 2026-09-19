from rest_framework import serializers

from core.fields import CloudinaryImageURLField
from gallery.models import GalleryImage, GalleryPhoto


class GalleryPhotoSerializer(serializers.ModelSerializer):
    """Read/write for one photo: upload a file to create, PATCH to reorder."""

    image = serializers.ImageField(write_only=True, required=False)
    image_url = CloudinaryImageURLField(source="image")

    class Meta:
        model = GalleryPhoto
        fields = ["id", "image", "image_url", "order"]
        read_only_fields = ["id"]

    def validate(self, attrs):
        if self.instance is None and "image" not in attrs:
            raise serializers.ValidationError({"image": "This field is required."})
        return attrs


class GalleryImageAdminSerializer(serializers.ModelSerializer):
    """Full CRUD surface for a gallery entry, drafts included.

    `photos` is read-only here -- photos are added/removed/reordered through
    the dedicated /api/admin/gallery/<id>/photos/ endpoints, not by resending
    the whole list on every save.
    """

    photos = GalleryPhotoSerializer(many=True, read_only=True)

    class Meta:
        model = GalleryImage
        fields = [
            "id",
            "caption",
            "county",
            "video_url",
            "published",
            "photos",
            "uploaded_at",
        ]
