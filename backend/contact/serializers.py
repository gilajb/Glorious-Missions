from rest_framework import serializers

from contact.models import ContactSubmission


class ContactSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSubmission
        fields = ["id", "name", "email", "message", "involvement_interest", "submitted_at"]
        read_only_fields = ["id", "submitted_at"]
