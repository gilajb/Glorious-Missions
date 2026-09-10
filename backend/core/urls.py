from django.urls import path

from core.views import SiteContentBySectionView, TeamMemberListView, TestimonialListView

app_name = "core"

urlpatterns = [
    path(
        "site-content/<slug:section>/",
        SiteContentBySectionView.as_view(),
        name="site-content-by-section",
    ),
    path("about/team/", TeamMemberListView.as_view(), name="team-member-list"),
    path("testimonials/", TestimonialListView.as_view(), name="testimonial-list"),
]
