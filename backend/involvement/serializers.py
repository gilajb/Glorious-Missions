from rest_framework import serializers

from involvement.models import GetInvolvedLink, GetInvolvedSubmission


class GetInvolvedSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = GetInvolvedSubmission
        fields = ["id", "name", "email", "message", "submitted_at"]
        read_only_fields = ["id", "submitted_at"]


class GetInvolvedLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = GetInvolvedLink
        fields = ["id", "title", "description", "link_type", "url", "display_order"]
