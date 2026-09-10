from django.urls import path

from involvement.views import GetInvolvedLinkListView, GetInvolvedSubmissionCreateView

app_name = "involvement"

urlpatterns = [
    path(
        "get-involved/links/",
        GetInvolvedLinkListView.as_view(),
        name="get-involved-link-list",
    ),
    path(
        "get-involved/submit/",
        GetInvolvedSubmissionCreateView.as_view(),
        name="get-involved-create",
    ),
]
