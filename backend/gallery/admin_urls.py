"""Staff-only admin API, mounted under /api/admin/ by missions_backend/urls.py.

    GET|POST         /api/admin/gallery/
    GET|PATCH|DELETE /api/admin/gallery/<id>/
    POST             /api/admin/gallery/<id>/toggle-publish/
    GET|POST         /api/admin/gallery/<gallery_id>/photos/
    PATCH|DELETE     /api/admin/gallery-photos/<photo_id>/
"""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from gallery.admin_views import (
    GalleryAdminViewSet,
    GalleryPhotoDetailView,
    GalleryPhotoListCreateView,
)

app_name = "gallery_admin"

router = DefaultRouter()
router.register("gallery", GalleryAdminViewSet, basename="gallery-admin")

urlpatterns = [
    path(
        "gallery/<int:gallery_id>/photos/",
        GalleryPhotoListCreateView.as_view(),
        name="gallery-photo-list",
    ),
    path(
        "gallery-photos/<int:photo_id>/",
        GalleryPhotoDetailView.as_view(),
        name="gallery-photo-detail",
    ),
    path("", include(router.urls)),
]
