from rest_framework import generics

from contact.models import ContactSubmission
from contact.serializers import ContactSubmissionSerializer
from core.notifications import notify_new_submission


class ContactSubmissionCreateView(generics.CreateAPIView):
    """Accepts a contact form submission and emails NOTIFY_EMAIL about it."""

    queryset = ContactSubmission.objects.all()
    serializer_class = ContactSubmissionSerializer
    # Rate limited per settings.REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"]["contact"].
    throttle_scope = "contact"

    def perform_create(self, serializer):
        submission = serializer.save()
        # Never lets an email failure fail the request -- it logs instead.
        notify_new_submission(submission, form_name="contact")
