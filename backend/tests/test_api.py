"""Smoke tests for the public API surface.

Covers the two things most likely to break silently: unpublished rows leaking
into a response, and a broken notification email taking down a submission.
"""

from datetime import timedelta
from unittest import mock

import cloudinary
from django.conf import settings
from django.core import mail
from django.core.cache import cache
from django.test import TestCase, override_settings
from django.urls import reverse
from django.utils import timezone

from contact.models import ContactSubmission
from core.models import SiteContent, TeamMember, Testimonial
from gallery.models import GalleryImage
from involvement.models import GetInvolvedLink, GetInvolvedSubmission
from missions.models import Mission


class PublishedFilteringTests(TestCase):
    """Read endpoints must expose published rows only."""

    def test_site_content_returns_the_published_block_for_the_section(self):
        SiteContent.objects.create(
            section="home", title="Welcome", body="Hi", published=True
        )
        SiteContent.objects.create(section="home", title="Draft", published=False)
        SiteContent.objects.create(section="about", title="Us", published=True)

        response = self.client.get("/api/site-content/home/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["title"], "Welcome")

    def test_site_content_rejects_an_unknown_section(self):
        self.assertEqual(self.client.get("/api/site-content/nope/").status_code, 404)

    def test_site_content_404s_when_the_section_has_no_published_content(self):
        response = self.client.get("/api/site-content/about/")
        self.assertEqual(response.status_code, 404)

    def test_site_content_prefers_the_most_recently_updated_duplicate(self):
        # The admin has no unique constraint stopping two published rows in
        # the same section; the endpoint must still return one object, not 500.
        older = SiteContent.objects.create(section="home", title="Old", published=True)
        SiteContent.objects.create(section="home", title="New", published=True)
        # Two back-to-back .create() calls can land on the same microsecond
        # (auto_now's resolution is clock-dependent), so force a real gap
        # with .update(), which -- unlike .save() -- does not re-trigger
        # auto_now.
        SiteContent.objects.filter(pk=older.pk).update(
            updated_at=timezone.now() - timedelta(days=1)
        )

        response = self.client.get("/api/site-content/home/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["title"], "New")

    def test_missions_returns_only_published_rows(self):
        Mission.objects.create(title="Live", summary="s", published=True)
        Mission.objects.create(title="Draft", summary="s", published=False)

        response = self.client.get("/api/missions/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual([row["title"] for row in response.json()], ["Live"])

    def test_gallery_returns_only_published_rows(self):
        GalleryImage.objects.create(image="sample", caption="Live", published=True)
        GalleryImage.objects.create(image="sample", caption="Draft", published=False)

        response = self.client.get("/api/gallery/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual([row["caption"] for row in response.json()], ["Live"])

    def test_gallery_image_serialises_county(self):
        GalleryImage.objects.create(image="sample", caption="Live", county="Samburu", published=True)

        row = self.client.get("/api/gallery/").json()[0]
        self.assertEqual(row["county"], "Samburu")

    def test_gallery_image_is_serialised_as_a_url(self):
        cloudinary.config(cloud_name="test-cloud")
        self.addCleanup(cloudinary.config, cloud_name=None)
        GalleryImage.objects.create(image="sample", caption="Live", published=True)

        image = self.client.get("/api/gallery/").json()[0]["image"]

        self.assertEqual(
            image, "https://res.cloudinary.com/test-cloud/image/upload/sample"
        )

    def test_image_is_null_rather_than_a_500_when_cloudinary_is_unconfigured(self):
        cloudinary.config(cloud_name=None)
        GalleryImage.objects.create(image="sample", caption="Live", published=True)

        with self.assertLogs("core.fields", level="WARNING"):
            response = self.client.get("/api/gallery/")

        self.assertEqual(response.status_code, 200)
        self.assertIsNone(response.json()[0]["image"])

    def test_missing_image_serialises_as_null(self):
        Mission.objects.create(title="Live", summary="s", published=True)

        self.assertIsNone(self.client.get("/api/missions/").json()[0]["image"])

    def test_mission_serialises_county_and_dates(self):
        Mission.objects.create(
            title="Nairobi Outreach",
            summary="s",
            county="Nairobi",
            start_date="2021-03-01",
            published=True,
        )

        row = self.client.get("/api/missions/").json()[0]
        self.assertEqual(row["county"], "Nairobi")
        self.assertEqual(row["start_date"], "2021-03-01")
        self.assertIsNone(row["end_date"])

    def test_team_members_returns_only_published_rows_by_display_order(self):
        TeamMember.objects.create(name="Second", role="Role", display_order=2, published=True)
        TeamMember.objects.create(name="Hidden", role="Role", display_order=1, published=False)
        TeamMember.objects.create(name="First", role="Role", display_order=1, published=True)

        response = self.client.get("/api/about/team/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual([row["name"] for row in response.json()], ["First", "Second"])

    def test_testimonials_returns_only_published_rows_newest_first(self):
        old = Testimonial.objects.create(quote="Old", author_name="A", published=True)
        Testimonial.objects.create(quote="Hidden", author_name="B", published=False)
        Testimonial.objects.create(quote="New", author_name="C", published=True)
        # Back-to-back .create() calls can tie under auto_now_add's clock
        # resolution (see the identical fix on the SiteContent duplicate
        # test above); force a real gap with .update(), which doesn't
        # re-trigger auto_now_add.
        Testimonial.objects.filter(pk=old.pk).update(
            created_at=timezone.now() - timedelta(days=1)
        )

        response = self.client.get("/api/testimonials/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual([row["quote"] for row in response.json()], ["New", "Old"])

    def test_get_involved_links_are_ordered_by_display_order(self):
        GetInvolvedLink.objects.create(
            title="Second", link_type="social", url="https://x.test", display_order=2
        )
        GetInvolvedLink.objects.create(
            title="First", link_type="donate", url="https://y.test", display_order=1
        )

        response = self.client.get("/api/get-involved/links/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            [row["title"] for row in response.json()], ["First", "Second"]
        )


@override_settings(
    NOTIFY_EMAIL="inbox@example.test",
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
)
class SubmissionTests(TestCase):
    """Both write endpoints store the row and notify, and survive email failure."""

    payload = {
        "name": "Ada",
        "email": "ada@example.test",
        "message": "Hello there.",
    }

    def setUp(self):
        mail.outbox.clear()
        # Each test gets a full throttle allowance, independent of test order
        # or of how many requests ThrottlingTests made in the same process.
        cache.clear()

    def test_contact_submission_is_stored_and_notified(self):
        response = self.client.post(
            reverse("contact:contact-create"), self.payload, content_type="application/json"
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(ContactSubmission.objects.count(), 1)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn("Ada", mail.outbox[0].subject)
        self.assertEqual(mail.outbox[0].to, ["inbox@example.test"])

    def test_get_involved_submission_is_stored_and_notified(self):
        response = self.client.post(
            reverse("involvement:get-involved-create"),
            self.payload,
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(GetInvolvedSubmission.objects.count(), 1)
        self.assertEqual(len(mail.outbox), 1)

    def test_submission_still_succeeds_when_the_email_fails(self):
        with mock.patch(
            "core.notifications.send_mail", side_effect=OSError("smtp is down")
        ):
            with self.assertLogs("core.notifications", level="ERROR"):
                response = self.client.post(
                    reverse("contact:contact-create"),
                    self.payload,
                    content_type="application/json",
                )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(ContactSubmission.objects.count(), 1)

    @override_settings(NOTIFY_EMAIL="")
    def test_submission_succeeds_when_notify_email_is_unset(self):
        response = self.client.post(
            reverse("contact:contact-create"), self.payload, content_type="application/json"
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(len(mail.outbox), 0)

    def test_invalid_payload_is_rejected(self):
        response = self.client.post(
            reverse("contact:contact-create"),
            {"name": "Ada", "email": "not-an-email", "message": ""},
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(ContactSubmission.objects.count(), 0)
        self.assertEqual(len(mail.outbox), 0)


class ThrottlingTests(TestCase):
    """The public POST endpoints stop accepting requests past the hourly cap.

    Rates come from settings.REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"] (5/hour
    for both scopes at time of writing) rather than being hardcoded here, so
    these stay correct if the limit is tuned later.
    """

    payload = {
        "name": "Ada",
        "email": "ada@example.test",
        "message": "Hello there.",
    }

    def setUp(self):
        cache.clear()
        rates = settings.REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"]
        self.contact_limit = int(rates["contact"].split("/")[0])
        self.get_involved_limit = int(rates["get_involved"].split("/")[0])

    def test_contact_endpoint_429s_after_the_limit_and_recovers_next_scope(self):
        url = reverse("contact:contact-create")

        for _ in range(self.contact_limit):
            response = self.client.post(url, self.payload, content_type="application/json")
            self.assertEqual(response.status_code, 201)

        response = self.client.post(url, self.payload, content_type="application/json")

        self.assertEqual(response.status_code, 429)
        self.assertIn("detail", response.json())
        self.assertEqual(ContactSubmission.objects.count(), self.contact_limit)

        # A different scope (get-involved) is unaffected by contact's throttle.
        other = self.client.post(
            reverse("involvement:get-involved-create"),
            self.payload,
            content_type="application/json",
        )
        self.assertEqual(other.status_code, 201)

    def test_get_involved_endpoint_429s_after_the_limit(self):
        url = reverse("involvement:get-involved-create")

        for _ in range(self.get_involved_limit):
            response = self.client.post(url, self.payload, content_type="application/json")
            self.assertEqual(response.status_code, 201)

        response = self.client.post(url, self.payload, content_type="application/json")

        self.assertEqual(response.status_code, 429)
        self.assertEqual(GetInvolvedSubmission.objects.count(), self.get_involved_limit)

    def test_read_endpoints_are_not_throttled(self):
        url = reverse("missions:mission-list")

        for _ in range(self.contact_limit + 5):
            response = self.client.get(url)
            self.assertEqual(response.status_code, 200)


class HealthCheckTests(TestCase):
    def test_healthz(self):
        response = self.client.get("/healthz/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok"})
