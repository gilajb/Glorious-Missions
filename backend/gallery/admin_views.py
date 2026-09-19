from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from core.permissions import IsStaffUser
from gallery.admin_serializers import GalleryImageAdminSerializer, GalleryPhotoSerializer
from gallery.models import GalleryImage, GalleryPhoto


class GalleryAdminViewSet(ModelViewSet):
    """Staff-only CRUD over every gallery entry, drafts included."""

    queryset = GalleryImage.objects.all()
    serializer_class = GalleryImageAdminSerializer
    permission_classes = [IsStaffUser]

    @action(detail=True, methods=["post"], url_path="toggle-publish")
    def toggle_publish(self, request, pk=None):
        entry = self.get_object()
        entry.published = not entry.published
        entry.save(update_fields=["published"])
        return Response(self.get_serializer(entry).data)


class GalleryPhotoListCreateView(generics.ListCreateAPIView):
    """List a gallery entry's photos, or add one (one file per request)."""

    serializer_class = GalleryPhotoSerializer
    permission_classes = [IsStaffUser]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return GalleryPhoto.objects.filter(gallery_image_id=self.kwargs["gallery_id"])

    def perform_create(self, serializer):
        gallery_image = get_object_or_404(GalleryImage, pk=self.kwargs["gallery_id"])
        next_order = gallery_image.photos.count()
        serializer.save(gallery_image=gallery_image, order=next_order)


class GalleryPhotoDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Reorder (PATCH order) or remove a single photo."""

    queryset = GalleryPhoto.objects.all()
    serializer_class = GalleryPhotoSerializer
    permission_classes = [IsStaffUser]
    lookup_url_kwarg = "photo_id"
