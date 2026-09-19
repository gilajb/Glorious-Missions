# Missions backend

Django 5.2 (LTS) + Django REST Framework. PostgreSQL in production with a
SQLite fallback for local development, Cloudinary for media, deployed to Render.

## Local setup

```bash
cd backend
python -m venv .venv
.venv/Scripts/activate          # Windows;  source .venv/bin/activate on macOS/Linux
pip install -r requirements.txt

cp .env.example .env            # then fill in SECRET_KEY (optional in DEBUG)
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

- Django admin: http://127.0.0.1:8000/admin/ (still works as a fallback/db-fix tool)
- React admin portal: run `frontend` too and visit its `/admin` route, logged in
  with the superuser you just created
- Browsable API (DEBUG only): http://127.0.0.1:8000/api/missions/

Run the tests with `python manage.py test`.

With no `DATABASE_URL` set the project uses `db.sqlite3`. With no `EMAIL_HOST`
set, notification emails are printed to the console instead of being sent.

**Image uploads need Cloudinary.** The image fields are `CloudinaryField`s, which
upload straight to Cloudinary rather than through Django's storage layer. Set
`CLOUDINARY_URL` in `.env` (a free Cloudinary account is enough) before adding
images through the admin. Everything else — migrations, the admin, all
endpoints — works without it.

## Apps

| App | Models |
| --- | --- |
| `core` | `SiteContent` (home / about copy blocks), `TeamMember`, `Testimonial` |
| `accounts` | none — admin login/logout/me over Django's built-in `User` + DRF's `Token` |
| `missions` | `Mission` (title, summary, sanitized `article` HTML, `county`, `start_date`/`end_date`, `publish_date`, legacy `image`, `video_url`), `MissionPhoto` (ordered, FK to `Mission`) |
| `gallery` | `GalleryImage` (caption, `county` — optional, unlike Mission's — legacy `image`, `video_url`), `GalleryPhoto` (ordered, FK to `GalleryImage`) |
| `contact` | `ContactSubmission` |
| `involvement` | `GetInvolvedSubmission`, `GetInvolvedLink` |

Public site copy calls the `missions` feature "Mission Mondays" (route
`/mission-mondays`, nav label, page copy) — that's a display-only rename on
the frontend. The Django app, `Mission` model, table names, and API path
(`/api/missions/`) are unchanged on purpose; see `frontend/src/App.jsx`'s
comment for the rationale.

`Mission.image` and `GalleryImage.image` are deprecated legacy single-photo
fields, kept only so pre-multi-photo rows and any lingering readers keep
working; new content uses each model's `photos` (`MissionPhoto`/
`GalleryPhoto`, ordered by an `order` int). Both `video_url` fields accept
only YouTube/Vimeo URLs (`core/validators.py::validate_video_url`) so the
frontend can safely turn them into an iframe embed. `Mission.article` is
admin-authored rich text HTML from the React admin's Tiptap editor,
sanitized server-side before saving (`core/sanitize.py`) — never trust it as
pre-sanitized on read alone; the frontend sanitizes again with DOMPurify
before rendering as defense-in-depth.

`core` also holds the shared helpers: `core/fields.py` (Cloudinary URL
serializer field), `core/admin_mixins.py` (admin thumbnail preview) and
`core/notifications.py` (submission emails).

## API

Every route below `/api/` except `/api/auth/*` and `/api/admin/*` is public,
read-mostly, and unpaginated — the original design intent, unchanged.

| Method | Path | Returns |
| --- | --- | --- |
| GET | `/api/site-content/home/` | The published `SiteContent` block for `home` |
| GET | `/api/site-content/about/` | The published `SiteContent` block for `about` |
| GET | `/api/missions/` | Published missions, newest first |
| GET | `/api/missions/<id>/` | One published mission, full `article`/`photos`/`video_url` included |
| GET | `/api/gallery/` | Published gallery images, newest first |
| GET | `/api/about/team/` | Published team members, by `display_order` |
| GET | `/api/testimonials/` | Published testimonials, newest first |
| POST | `/api/contact/` | 201 + the created submission (throttled, see below) |
| GET | `/api/get-involved/links/` | All links, by `display_order` |
| POST | `/api/get-involved/submit/` | 201 + the created submission (throttled, see below) |
| GET | `/healthz/` | `{"status": "ok"}` — Render health check |

### Admin portal API

Backs the React admin at `frontend`'s `/admin` route. Every route here
requires `Authorization: Token <token>` from a **staff** user
(`IsStaffUser` in `core/permissions.py`) — a non-staff `User` can log into
Django's own `/admin/` if given access there, but cannot obtain a token
here. Tokens are DRF's plain `rest_framework.authtoken` (no expiry; revoke
one by logging out, or by deleting it in Django admin).

| Method | Path | Notes |
| --- | --- | --- |
| POST | `/api/auth/login/` | `{username, password}` -> `{token, user}`. Throttled (`login` scope, 10/hour/IP) |
| POST | `/api/auth/logout/` | Deletes the caller's token |
| GET | `/api/auth/me/` | The current user; the SPA uses this to validate a stored token after reload |
| GET/POST/PATCH/DELETE | `/api/admin/missions/`, `/api/admin/missions/<id>/` | Full CRUD, drafts included |
| POST | `/api/admin/missions/<id>/toggle-publish/` | Flips `published` |
| GET/POST | `/api/admin/missions/<id>/photos/` | List/add photos (multipart, one file per request) |
| PATCH/DELETE | `/api/admin/mission-photos/<photo_id>/` | Reorder (`{"order": n}`) or remove one photo |
| GET/POST/PATCH/DELETE | `/api/admin/gallery/`, `/api/admin/gallery/<id>/` | Same shape as missions, for `GalleryImage` |
| POST | `/api/admin/gallery/<id>/toggle-publish/` | Flips `published` |
| GET/POST | `/api/admin/gallery/<id>/photos/` | List/add photos (multipart, one file per request) |
| PATCH/DELETE | `/api/admin/gallery-photos/<photo_id>/` | Reorder or remove one photo |

Photo uploads proxy through Django straight into each model's existing
`CloudinaryField` (see `core/fields.py`) rather than a direct signed
browser-to-Cloudinary upload — deliberately, since videos are handled as
YouTube/Vimeo links rather than uploaded files, so there's no large binary
payload that would need to bypass the backend. The admin UI uploads photos
one file at a time (not batched) so a slow/cold-started request doesn't
block the rest.

Read endpoints return only rows with `published=True`. `GetInvolvedLink` has no
`published` field, so every row is public — bear that in mind when adding rows.

`Mission.county` and `GalleryImage.county` are free text (not a fixed enum):
the frontend's Missions and Gallery pages each derive their filter pills from
whatever county values actually appear in the published rows, so a new
county just needs one row published in it, no code change. `Mission`'s
`start_date`/`end_date` are both optional; a blank `end_date` means the
mission is ongoing. `GalleryImage.county` is optional (blank allowed) since
not every photo is tied to one place, unlike a `Mission`.

`/api/site-content/<section>/` returns a **single object**: each section holds
one editable block. 404 if the section name is unknown, or if it's known but has
no published content yet. If two rows are ever published for the same section
(nothing in the admin currently prevents it), the most recently updated one wins
rather than the endpoint erroring.

POST bodies are `{"name": ..., "email": ..., "message": ...}`. On success the
API emails `NOTIFY_EMAIL`; if that send fails it is logged and the request still
returns 201.

**Why `TeamMember`/`Testimonial` exist but other frontend copy doesn't.** Not
every piece of marketing copy gets a model. The line: content tied to a fact
that changes independent of a redesign (who's on the team, which quote is
featured) gets a model so the client can update it without a developer.
Content that's really permanent brand/theological copy (the homepage's "Shuka
Framework" pillars, About's "Three Tenets", the founding-charter quote) stays
in the frontend as code — a future edit to that would likely come with a
broader content review anyway. Reassess this line if it stops making sense in
practice, but don't add a model just because a page happens to have a static
block; add one when the content is a *fact* that goes stale on its own.

**Rate limiting.** `POST /api/contact/` and `POST /api/get-involved/submit/` are
each capped at 5 requests/hour per IP via DRF's `ScopedRateThrottle`
(`throttle_scope = "contact"` / `"get_involved"` on the view, rates in
`REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"]` in `settings.py`). `POST
/api/auth/login/` has its own `login` scope, 10/hour/IP, to blunt brute-force
against the admin portal. A request past a limit gets `429 Too Many Requests`
with a `Retry-After` header. Each endpoint's limit is independent. Read
endpoints and the authenticated `/api/admin/*` endpoints are not throttled.
Tune rates in `settings.py` if they prove too strict for legitimate use.

## Environment variables

| Variable | Required | Notes |
| --- | --- | --- |
| `SECRET_KEY` | in production | Startup fails without it when `DEBUG=False` |
| `DEBUG` | no | Defaults to `False` |
| `ALLOWED_HOSTS` | in production | Comma-separated; Render's own hostname is added automatically |
| `DATABASE_URL` | in production | Blank falls back to SQLite |
| `CLOUDINARY_URL` | for image uploads | `cloudinary://key:secret@cloud_name` |
| `CORS_ALLOWED_ORIGINS` | in production | Comma-separated, e.g. `https://glorious.vercel.app` |
| `CORS_ALLOWED_ORIGIN_REGEXES` | no | For Vercel preview URLs |
| `EMAIL_HOST` | for real email | Blank uses the console backend |
| `EMAIL_PORT` | no | Defaults to `587`; TLS/SSL inferred from the port |
| `EMAIL_HOST_USER` | for real email | |
| `EMAIL_HOST_PASSWORD` | for real email | |
| `NOTIFY_EMAIL` | for real email | Where submissions are sent |
| `DEFAULT_FROM_EMAIL` | no | Defaults to `EMAIL_HOST_USER` |

## Deploying to Render

The repo root holds `render.yaml`, which sets `rootDir: backend`. Create a new
Blueprint in Render, point it at the repo, then fill in the variables marked
`sync: false` (`ALLOWED_HOSTS`, `CLOUDINARY_URL`, `CORS_ALLOWED_ORIGINS`, the
email settings). `SECRET_KEY` is generated by Render and `DATABASE_URL` is wired
from the managed PostgreSQL instance.

To configure the service by hand instead:

- **Root directory:** `backend`
- **Build:** `pip install -r requirements.txt && python manage.py collectstatic --no-input && python manage.py migrate --no-input`
- **Start:** `gunicorn missions_backend.wsgi:application --bind 0.0.0.0:$PORT --workers 3 --timeout 60 --log-file -`

Static files for the admin are served by WhiteNoise
(`CompressedManifestStaticFilesStorage`), so `collectstatic` must run at build
time — it is in both the Blueprint build command and the manual one above.

When `DEBUG=False` the project also enables HTTPS redirect, HSTS, secure
cookies, and `SECURE_PROXY_SSL_HEADER` for Render's TLS-terminating proxy.

## Known gaps for v1

- **Rate limiting is IP-based only** (DRF `ScopedRateThrottle`, 5/hour per
  endpoint — see API section above). That stops casual spam but not a
  distributed sender or anyone rotating IPs; a CAPTCHA on both forms would
  close that gap before a real launch. Cache-backed, so it resets if the
  process restarts (Render's default `LocMemCache`) — fine for v1, but note it
  if the app ever runs multiple instances, since each instance would count
  separately.
- **No pagination** — fine while the dataset is small, but `/api/missions/` and
  `/api/gallery/` return everything.
- **Email is sent synchronously** inside the request. A slow SMTP server slows
  the response; a background task queue would fix that if it becomes a problem.
- **Tests are smoke-level** (`backend/tests/test_api.py`): they cover
  published/unpublished filtering, image serialisation, that a submission
  still succeeds when the notification email fails, and the admin portal's
  auth/CRUD/publish/photo-upload/sanitization/video-validation paths. Photo
  upload tests mock `cloudinary.uploader.upload_resource` rather than
  hitting real Cloudinary.
- **Admin tokens don't expire.** Fine for a handful of trusted staff users;
  revoke a leaked one via `/api/auth/logout/` or by deleting it in Django
  admin (`Auth Token` model). A team with turnover would want
  `djangorestframework-simplejwt`'s short-lived tokens instead.
- **The React admin stores its token in `sessionStorage`.** Cleared on tab
  close, but readable by any script on the page — an XSS bug anywhere in the
  admin bundle could exfiltrate it. Mitigated by keeping the rich text
  editor's output (and the sanitizer's allow-list in `core/sanitize.py`)
  deliberately small; there is no other place admin-controlled HTML reaches
  the DOM.
