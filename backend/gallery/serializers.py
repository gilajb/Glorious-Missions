from rest_framework import serializers

from core.fields import CloudinaryImageURLField
from gallery.models import GalleryImage, GalleryPhoto


class GalleryPhotoSerializer(serializers.ModelSerializer):
    image = CloudinaryImageURLField()

    class Meta:
        model = GalleryPhoto
        fields = ["id", "image", "order"]


class GalleryImageSerializer(serializers.ModelSerializer):
    # Legacy cover field: the first uploaded photo, falling back to the
    # original single `image` column for rows that predate multi-photo
    # support. New frontend code should read `photos` instead.
    image = serializers.SerializerMethodField()
    photos = GalleryPhotoSerializer(many=True, read_only=True)

    class Meta:
        model = GalleryImage
        fields = ["id", "image", "category", "photos", "uploaded_at"]

    def get_image(self, obj):
        cover = next(iter(obj.photos.all()), None)
        return CloudinaryImageURLField().to_representation(
            cover.image if cover else obj.image
        )
