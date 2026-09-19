"""Staff-only admin API, mounted under /api/admin/ by missions_backend/urls.py.

    GET|POST         /api/admin/missions/
    GET|PATCH|DELETE /api/admin/missions/<id>/
    POST             /api/admin/missions/<id>/toggle-publish/
    GET|POST         /api/admin/missions/<mission_id>/photos/
    PATCH|DELETE     /api/admin/mission-photos/<photo_id>/
"""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from missions.admin_views import (
    MissionAdminViewSet,
    MissionPhotoDetailView,
    MissionPhotoListCreateView,
)

app_name = "missions_admin"

router = DefaultRouter()
router.register("missions", MissionAdminViewSet, basename="mission-admin")

urlpatterns = [
    path(
        "missions/<int:mission_id>/photos/",
        MissionPhotoListCreateView.as_view(),
        name="mission-photo-list",
    ),
    path(
        "mission-photos/<int:photo_id>/",
        MissionPhotoDetailView.as_view(),
        name="mission-photo-detail",
    ),
    path("", include(router.urls)),
]
