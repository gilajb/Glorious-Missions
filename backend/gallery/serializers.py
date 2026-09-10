from rest_framework import serializers

from core.fields import CloudinaryImageURLField
from gallery.models import GalleryImage


class GalleryImageSerializer(serializers.ModelSerializer):
    image = CloudinaryImageURLField()

    class Meta:
        model = GalleryImage
        fields = ["id", "image", "caption", "county", "uploaded_at"]
