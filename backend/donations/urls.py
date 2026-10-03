from django.urls import path

from donations.views import (
    DonationConfigView,
    DonationCreateView,
    DonationVerifyView,
    paystack_webhook,
)

app_name = "donations"

urlpatterns = [
    path("donations/", DonationCreateView.as_view(), name="donation-create"),
    path("donations/config/", DonationConfigView.as_view(), name="donation-config"),
    path("donations/webhook/", paystack_webhook, name="paystack-webhook"),
    path(
        "donations/<str:reference>/verify/",
        DonationVerifyView.as_view(),
        name="donation-verify",
    ),
]
