from rest_framework import generics

from missions.models import Mission
from missions.serializers import MissionSerializer


class MissionListView(generics.ListAPIView):
    """All published missions, newest first."""

    serializer_class = MissionSerializer
    queryset = Mission.objects.filter(published=True).prefetch_related("photos")


class MissionDetailView(generics.RetrieveAPIView):
    """A single published mission, with its full article/photos/video."""

    serializer_class = MissionSerializer
    queryset = Mission.objects.filter(published=True).prefetch_related("photos")
