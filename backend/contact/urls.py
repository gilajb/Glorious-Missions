from django.urls import path

from contact.views import ContactSubmissionCreateView

app_name = "contact"

urlpatterns = [
    path("contact/", ContactSubmissionCreateView.as_view(), name="contact-create"),
]
