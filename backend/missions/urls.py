from django.urls import path

from missions.views import MissionListView

app_name = "missions"

urlpatterns = [
    path("missions/", MissionListView.as_view(), name="mission-list"),
]
