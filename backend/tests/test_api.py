"""Smoke tests for the public API surface.

Covers the two things most likely to break silently: unpublished rows leaking
into a response, and a broken notification email taking down a submission.
"""

from datetime import timedelta
from unittest import mock

import cloudinary
from django.conf import settings
from django.contrib.auth.models import User
from django.core import mail
from django.core.cache import cache
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from django.urls import reverse
from django.utils import timezone
from rest_framework.authtoken.models import Token

from contact.models import ContactSubmission
from core.models import SiteContent, TeamMember, Testimonial
from gallery.models import GalleryImage, GalleryPhoto
from involvement.models import GetInvolvedLink, GetInvolvedSubmission
from missions.models import Mission, MissionPhoto


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
        GalleryImage.objects.create(image="live-sample", published=True)
        GalleryImage.objects.create(image="draft-sample", published=False)

        response = self.client.get("/api/gallery/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

    def test_gallery_image_is_serialised_as_a_url(self):
        cloudinary.config(cloud_name="test-cloud")
        self.addCleanup(cloudinary.config, cloud_name=None)
        GalleryImage.objects.create(image="sample", published=True)

        image = self.client.get("/api/gallery/").json()[0]["image"]

        self.assertEqual(
            image, "https://res.cloudinary.com/test-cloud/image/upload/sample"
        )

    def test_image_is_null_rather_than_a_500_when_cloudinary_is_unconfigured(self):
        cloudinary.config(cloud_name=None)
        GalleryImage.objects.create(image="sample", published=True)

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


def _fake_uploaded_photo(public_id="fake-photo"):
    """A CloudinaryResource standing in for a real upload response, so photo
    upload tests never make a real network call to Cloudinary."""
    return cloudinary.CloudinaryResource(public_id=public_id)


_TINY_GIF = (
    b"GIF87a\x01\x00\x01\x00\x81\x00\x00\xff\xff\xff\x00\x00\x00\x00\x00\x00\x00"
    b"\x00\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x08\x04\x00\x01\x04\x04\x00;"
)


def _tiny_upload(name="photo.gif"):
    return SimpleUploadedFile(name, _TINY_GIF, content_type="image/gif")


class AdminAuthTests(TestCase):
    """Login/logout/me for the React admin portal."""

    def setUp(self):
        cache.clear()
        self.staff = User.objects.create_user(
            username="admin", password="s3cret-pass", is_staff=True
        )
        self.non_staff = User.objects.create_user(
            username="visitor", password="s3cret-pass", is_staff=False
        )

    def test_staff_login_returns_a_token(self):
        response = self.client.post(
            reverse("accounts:login"),
            {"username": "admin", "password": "s3cret-pass"},
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        body = response.json()
        self.assertEqual(body["user"]["username"], "admin")
        self.assertTrue(Token.objects.filter(key=body["token"], user=self.staff).exists())

    def test_wrong_password_is_rejected_without_revealing_which_field(self):
        response = self.client.post(
            reverse("accounts:login"),
            {"username": "admin", "password": "nope"},
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("Invalid username or password", response.json()["detail"])

    def test_non_staff_user_cannot_log_in(self):
        response = self.client.post(
            reverse("accounts:login"),
            {"username": "visitor", "password": "s3cret-pass"},
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)

    def test_me_requires_a_valid_token(self):
        self.assertEqual(self.client.get(reverse("accounts:me")).status_code, 401)

        token = Token.objects.create(user=self.staff)
        response = self.client.get(
            reverse("accounts:me"), HTTP_AUTHORIZATION=f"Token {token.key}"
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["username"], "admin")

    def test_logout_deletes_the_token(self):
        token = Token.objects.create(user=self.staff)

        response = self.client.post(
            reverse("accounts:logout"), HTTP_AUTHORIZATION=f"Token {token.key}"
        )

        self.assertEqual(response.status_code, 204)
        self.assertFalse(Token.objects.filter(pk=token.pk).exists())


class AdminMissionApiTests(TestCase):
    """Staff-only CRUD for Mission Monday posts."""

    def setUp(self):
        cache.clear()
        staff = User.objects.create_user(username="admin", password="x", is_staff=True)
        self.token = Token.objects.create(user=staff).key
        self.auth_header = {"HTTP_AUTHORIZATION": f"Token {self.token}"}

    def test_unauthenticated_write_is_rejected(self):
        response = self.client.post(
            "/api/admin/missions/",
            {"title": "Draft", "summary": "s"},
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 401)

    def test_authenticated_staff_can_create_a_draft_and_it_stays_hidden(self):
        response = self.client.post(
            "/api/admin/missions/",
            {"title": "Draft", "summary": "s", "county": "Nairobi"},
            content_type="application/json",
            **self.auth_header,
        )

        self.assertEqual(response.status_code, 201, response.content)
        self.assertEqual(Mission.objects.count(), 1)
        # Not published -> invisible on the public endpoint.
        self.assertEqual(self.client.get("/api/missions/").json(), [])

    def test_toggle_publish_makes_it_visible_publicly(self):
        mission = Mission.objects.create(title="Draft", summary="s", published=False)

        response = self.client.post(
            f"/api/admin/missions/{mission.pk}/toggle-publish/", **self.auth_header
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["published"])
        self.assertEqual(
            [row["title"] for row in self.client.get("/api/missions/").json()], ["Draft"]
        )

    def test_rejects_a_non_youtube_vimeo_video_url(self):
        response = self.client.post(
            "/api/admin/missions/",
            {"title": "M", "summary": "s", "video_url": "https://example.com/video.mp4"},
            content_type="application/json",
            **self.auth_header,
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("video_url", response.json())

    def test_accepts_a_youtube_video_url(self):
        response = self.client.post(
            "/api/admin/missions/",
            {
                "title": "M",
                "summary": "s",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
            content_type="application/json",
            **self.auth_header,
        )

        self.assertEqual(response.status_code, 201, response.content)

    def test_article_html_is_sanitized_on_save(self):
        mission = Mission.objects.create(title="M", summary="s")

        response = self.client.patch(
            f"/api/admin/missions/{mission.pk}/",
            {"article": "<script>alert(1)</script><p>Hello <strong>world</strong></p>"},
            content_type="application/json",
            **self.auth_header,
        )

        self.assertEqual(response.status_code, 200, response.content)
        mission.refresh_from_db()
        self.assertNotIn("<script>", mission.article)
        self.assertIn("<strong>world</strong>", mission.article)

    @mock.patch("cloudinary.uploader.upload_resource")
    def test_adding_photos_reflects_on_the_public_endpoint_in_order(self, upload_resource):
        upload_resource.side_effect = [
            _fake_uploaded_photo("first"),
            _fake_uploaded_photo("second"),
        ]
        mission = Mission.objects.create(title="M", summary="s", published=True)

        for name in ["a.gif", "b.gif"]:
            response = self.client.post(
                f"/api/admin/missions/{mission.pk}/photos/",
                {"image": _tiny_upload(name)},
                **self.auth_header,
            )
            self.assertEqual(response.status_code, 201, response.content)

        self.assertEqual(MissionPhoto.objects.filter(mission=mission).count(), 2)
        photos = self.client.get("/api/missions/").json()[0]["photos"]
        self.assertEqual([p["order"] for p in photos], [0, 1])

    @mock.patch("cloudinary.uploader.upload_resource")
    def test_deleting_a_photo_removes_it(self, upload_resource):
        upload_resource.return_value = _fake_uploaded_photo()
        mission = Mission.objects.create(title="M", summary="s")
        self.client.post(
            f"/api/admin/missions/{mission.pk}/photos/",
            {"image": _tiny_upload()},
            **self.auth_header,
        )
        photo = MissionPhoto.objects.get(mission=mission)

        response = self.client.delete(
            f"/api/admin/mission-photos/{photo.pk}/", **self.auth_header
        )

        self.assertEqual(response.status_code, 204)
        self.assertFalse(MissionPhoto.objects.filter(pk=photo.pk).exists())


class AdminGalleryApiTests(TestCase):
    """Staff-only CRUD for gallery entries."""

    def setUp(self):
        cache.clear()
        staff = User.objects.create_user(username="admin", password="x", is_staff=True)
        self.auth_header = {
            "HTTP_AUTHORIZATION": f"Token {Token.objects.create(user=staff).key}"
        }

    def test_unauthenticated_write_is_rejected(self):
        response = self.client.post(
            "/api/admin/gallery/", {}, content_type="application/json"
        )
        self.assertEqual(response.status_code, 401)

    def test_authenticated_staff_can_create_a_draft_entry(self):
        response = self.client.post(
            "/api/admin/gallery/",
            {},
            content_type="application/json",
            **self.auth_header,
        )

        self.assertEqual(response.status_code, 201, response.content)
        self.assertEqual(self.client.get("/api/gallery/").json(), [])

    @mock.patch("cloudinary.uploader.upload_resource")
    def test_adding_a_photo_reflects_on_the_public_endpoint(self, upload_resource):
        upload_resource.return_value = _fake_uploaded_photo()
        entry = GalleryImage.objects.create(image="", published=True)

        response = self.client.post(
            f"/api/admin/gallery/{entry.pk}/photos/",
            {"image": _tiny_upload()},
            **self.auth_header,
        )

        self.assertEqual(response.status_code, 201, response.content)
        self.assertEqual(GalleryPhoto.objects.filter(gallery_image=entry).count(), 1)
        row = self.client.get("/api/gallery/").json()[0]
        self.assertEqual(len(row["photos"]), 1)
