from rest_framework import serializers

from core.fields import CloudinaryImageURLField
from missions.models import Mission, MissionPhoto


class MissionPhotoSerializer(serializers.ModelSerializer):
    image = CloudinaryImageURLField()

    class Meta:
        model = MissionPhoto
        fields = ["id", "image", "order"]


class MissionSerializer(serializers.ModelSerializer):
    # Legacy cover field: the first uploaded photo, falling back to the
    # original single `image` column for rows that predate multi-photo
    # support. New frontend code should read `photos` instead.
    image = serializers.SerializerMethodField()
    photos = MissionPhotoSerializer(many=True, read_only=True)

    class Meta:
        model = Mission
        fields = [
            "id",
            "title",
            "summary",
            "article",
            "county",
            "start_date",
            "end_date",
            "image",
            "photos",
            "video_url",
            "publish_date",
            "created_at",
            "updated_at",
        ]

    def get_image(self, obj):
        cover = next(iter(obj.photos.all()), None)
        return CloudinaryImageURLField().to_representation(
            cover.image if cover else obj.image
        )
