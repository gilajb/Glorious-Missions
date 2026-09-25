"""Root URL configuration.

    GET  /api/site-content/home/
    GET  /api/site-content/about/
    GET  /api/missions/
    GET  /api/gallery/
    POST /api/contact/
    GET  /api/get-involved/links/
    POST /api/get-involved/submit/

    POST /api/auth/login/
    POST /api/auth/logout/
    GET  /api/auth/me/

    /api/admin/missions/...   (staff-only CRUD, see missions/admin_urls.py)
    /api/admin/gallery/...    (staff-only CRUD, see gallery/admin_urls.py)
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path

admin.site.site_header = "Mission Monday administration"
admin.site.site_title = "Mission Monday admin"
admin.site.index_title = "Site content"


def healthz(_request):
    """Cheap liveness probe for Render."""
    return JsonResponse({"status": "ok"})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("healthz/", healthz, name="healthz"),
    path("api/", include("core.urls")),
    path("api/", include("accounts.urls")),
    path("api/", include("missions.urls")),
    path("api/", include("gallery.urls")),
    path("api/", include("contact.urls")),
    path("api/", include("involvement.urls")),
    path("api/admin/", include("missions.admin_urls")),
    path("api/admin/", include("gallery.admin_urls")),
]

if settings.DEBUG and not settings.CLOUDINARY_URL:
    # Local development without Cloudinary: serve uploads from MEDIA_ROOT.
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
