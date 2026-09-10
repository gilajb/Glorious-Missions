from rest_framework import generics

from gallery.models import GalleryImage
from gallery.serializers import GalleryImageSerializer


class GalleryImageListView(generics.ListAPIView):
    """All published gallery images, most recently uploaded first."""

    serializer_class = GalleryImageSerializer
    queryset = GalleryImage.objects.filter(published=True)
