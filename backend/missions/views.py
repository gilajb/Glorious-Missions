from rest_framework import generics

from missions.models import Mission
from missions.serializers import MissionSerializer


class MissionListView(generics.ListAPIView):
    """All published missions, newest first."""

    serializer_class = MissionSerializer
    queryset = Mission.objects.filter(published=True)
