"""Rate limiting outside DRF's reach."""

import time

from django.conf import settings
from django.core.cache import cache
from django.http import HttpResponse


def _parse_rate(rate):
    """"10/hour" -> (10, 3600), matching DRF's own rate string format."""
    num, period = rate.split("/")
    seconds = {"s": 1, "m": 60, "h": 3600, "d": 86400}[period[0]]
    return int(num), seconds


class AdminLoginThrottleMiddleware:
    """Rate-limits POSTs to the Django admin's own login page.

    DRF's ScopedRateThrottle already protects /api/auth/login/ (the React
    admin's login endpoint) via the "login" scope, but django.contrib.admin
    mounts a second, completely separate login form at /admin/login/ that
    checks the same staff credentials and had no throttling at all. This
    reuses the same rate so both entry points into the same accounts are
    equally hardened against brute-forcing.
    """

    def __init__(self, get_response):
        self.get_response = get_response
        rate = settings.REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"]["login"]
        self.limit, self.window = _parse_rate(rate)

    def __call__(self, request):
        if request.method == "POST" and request.path == "/admin/login/":
            ident = self._get_ident(request)
            cache_key = f"admin-login-throttle:{ident}"
            now = time.time()
            history = [t for t in cache.get(cache_key, []) if t > now - self.window]
            if len(history) >= self.limit:
                return HttpResponse(
                    "Too many login attempts. Please try again later.", status=429
                )
            history.append(now)
            cache.set(cache_key, history, self.window)
        return self.get_response(request)

    @staticmethod
    def _get_ident(request):
        forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        return request.META.get("REMOTE_ADDR")
