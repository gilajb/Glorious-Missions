from rest_framework import serializers

from core.fields import CloudinaryImageURLField
from core.models import SiteContent, TeamMember, Testimonial


class SiteContentSerializer(serializers.ModelSerializer):
    image = CloudinaryImageURLField()

    class Meta:
        model = SiteContent
        fields = ["id", "section", "title", "body", "image", "updated_at"]


class TeamMemberSerializer(serializers.ModelSerializer):
    image = CloudinaryImageURLField()

    class Meta:
        model = TeamMember
        fields = ["id", "name", "role", "bio", "location", "image", "display_order"]


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = ["id", "quote", "author_name", "author_role", "created_at"]
