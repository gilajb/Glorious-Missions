from rest_framework import serializers

from core.fields import CloudinaryImageURLField
from core.sanitize import sanitize_article_html
from core.validators import validate_image_file_size
from missions.models import Mission, MissionPhoto


class MissionPhotoSerializer(serializers.ModelSerializer):
    """Read/write for one photo: upload a file to create, PATCH to reorder."""

    image = serializers.ImageField(
        write_only=True, required=False, validators=[validate_image_file_size]
    )
    image_url = CloudinaryImageURLField(source="image")

    class Meta:
        model = MissionPhoto
        fields = ["id", "image", "image_url", "order"]
        read_only_fields = ["id"]

    def validate(self, attrs):
        if self.instance is None and "image" not in attrs:
            raise serializers.ValidationError({"image": "This field is required."})
        return attrs


class MissionAdminSerializer(serializers.ModelSerializer):
    """Full CRUD surface for a Mission Monday post, drafts included.

    `photos` is read-only here -- photos are added/removed/reordered through
    the dedicated /api/admin/missions/<id>/photos/ endpoints, not by
    resending the whole list on every save.
    """

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
            "video_url",
            "publish_date",
            "published",
            "photos",
            "created_at",
            "updated_at",
        ]

    def validate_article(self, value):
        return sanitize_article_html(value)
