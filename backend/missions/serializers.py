from rest_framework import serializers

from core.fields import CloudinaryImageURLField
from missions.models import Mission


class MissionSerializer(serializers.ModelSerializer):
    image = CloudinaryImageURLField()

    class Meta:
        model = Mission
        fields = [
            "id",
            "title",
            "summary",
            "county",
            "start_date",
            "end_date",
            "image",
            "created_at",
            "updated_at",
        ]
