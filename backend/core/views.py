from django.http import Http404
from rest_framework import generics

from core.models import SiteContent, TeamMember, Testimonial
from core.serializers import SiteContentSerializer, TeamMemberSerializer, TestimonialSerializer


class SiteContentBySectionView(generics.RetrieveAPIView):
    """The published content block for one section, e.g. /api/site-content/home/.

    Each section (home, about) is a single editable block, so this returns one
    object. 404 if the section name is unknown, or if it is known but has no
    published content yet.
    """

    serializer_class = SiteContentSerializer

    def get_object(self):
        section = self.kwargs["section"]
        if section not in SiteContent.Section.values:
            raise Http404(f"Unknown site content section: {section}")

        # .first() rather than .get(): a section is meant to hold one published
        # block, but nothing in the admin enforces that, so a duplicate must
        # not turn into a 500. Most recently updated wins.
        instance = (
            SiteContent.objects.filter(section=section, published=True)
            .order_by("-updated_at")
            .first()
        )
        if instance is None:
            raise Http404(f"No published content for section: {section}")
        return instance


class TeamMemberListView(generics.ListAPIView):
    """Published team members, by display_order -- About's Leadership grid."""

    serializer_class = TeamMemberSerializer
    queryset = TeamMember.objects.filter(published=True)


class TestimonialListView(generics.ListAPIView):
    """Published testimonials, newest first.

    Currently only one is shown at a time (Home's closing section takes the
    first result), but this returns the full list rather than a single
    object so a future page can show more than one without an API change.
    """

    serializer_class = TestimonialSerializer
    queryset = Testimonial.objects.filter(published=True)
