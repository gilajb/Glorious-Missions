from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from core.permissions import IsStaffUser
from missions.admin_serializers import MissionAdminSerializer, MissionPhotoSerializer
from missions.models import Mission, MissionPhoto


class MissionAdminViewSet(ModelViewSet):
    """Staff-only CRUD over every Mission Monday post, drafts included."""

    queryset = Mission.objects.all()
    serializer_class = MissionAdminSerializer
    permission_classes = [IsStaffUser]
    # Backstop against a leaked/compromised staff token, not a normal-use
    # limit -- see settings.REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"]["admin"].
    throttle_scope = "admin"

    @action(detail=True, methods=["post"], url_path="toggle-publish")
    def toggle_publish(self, request, pk=None):
        mission = self.get_object()
        mission.published = not mission.published
        mission.save(update_fields=["published"])
        return Response(self.get_serializer(mission).data)


class MissionPhotoListCreateView(generics.ListCreateAPIView):
    """List a mission's photos, or add one (one file per request)."""

    serializer_class = MissionPhotoSerializer
    permission_classes = [IsStaffUser]
    parser_classes = [MultiPartParser, FormParser]
    throttle_scope = "admin"

    def get_queryset(self):
        return MissionPhoto.objects.filter(mission_id=self.kwargs["mission_id"])

    def perform_create(self, serializer):
        mission = get_object_or_404(Mission, pk=self.kwargs["mission_id"])
        next_order = mission.photos.count()
        serializer.save(mission=mission, order=next_order)


class MissionPhotoDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Reorder (PATCH order) or remove a single photo."""

    queryset = MissionPhoto.objects.all()
    serializer_class = MissionPhotoSerializer
    permission_classes = [IsStaffUser]
    lookup_url_kwarg = "photo_id"
    throttle_scope = "admin"
