from django.urls import path

from gallery.views import GalleryImageListView

app_name = "gallery"

urlpatterns = [
    path("gallery/", GalleryImageListView.as_view(), name="gallery-image-list"),
]
