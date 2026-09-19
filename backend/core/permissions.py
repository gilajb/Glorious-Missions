"""Shared DRF permissions."""

from rest_framework.permissions import BasePermission


class IsStaffUser(BasePermission):
    """Allows access only to authenticated staff users.

    Used on every admin write endpoint. Public read endpoints are untouched
    and keep relying on the global AllowAny default.
    """

    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and user.is_staff)
