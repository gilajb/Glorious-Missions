from rest_framework import generics

from core.notifications import notify_new_submission
from involvement.models import GetInvolvedLink, GetInvolvedSubmission
from involvement.serializers import (
    GetInvolvedLinkSerializer,
    GetInvolvedSubmissionSerializer,
)


class GetInvolvedLinkListView(generics.ListAPIView):
    """Donate / social / email links, in display order.

    GetInvolvedLink has no `published` flag, so every row is public.
    """

    serializer_class = GetInvolvedLinkSerializer
    queryset = GetInvolvedLink.objects.all()


class GetInvolvedSubmissionCreateView(generics.CreateAPIView):
    """Accepts a get-involved submission and emails NOTIFY_EMAIL about it."""

    queryset = GetInvolvedSubmission.objects.all()
    serializer_class = GetInvolvedSubmissionSerializer
    # Rate limited per settings.REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"]["get_involved"].
    throttle_scope = "get_involved"

    def perform_create(self, serializer):
        submission = serializer.save()
        # Never lets an email failure fail the request -- it logs instead.
        notify_new_submission(submission, form_name="get involved")
