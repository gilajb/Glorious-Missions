from django.urls import path

from missions.views import MissionDetailView, MissionListView

app_name = "missions"

urlpatterns = [
    path("missions/", MissionListView.as_view(), name="mission-list"),
    path("missions/<int:pk>/", MissionDetailView.as_view(), name="mission-detail"),
]
