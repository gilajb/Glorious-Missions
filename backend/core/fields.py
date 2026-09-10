"""Shared DRF fields."""

import logging

from rest_framework import serializers

logger = logging.getLogger(__name__)


class CloudinaryImageURLField(serializers.Field):
    """Serialises a ``CloudinaryField`` as an absolute HTTPS delivery URL.

    Returns ``None`` when no image has been uploaded, so the frontend can
    branch on a missing image without string-checking.

    Building a URL needs a configured ``CLOUDINARY_URL``; without one the
    Cloudinary SDK raises. A missing image must never turn a whole list
    endpoint into a 500, so that degrades to ``None`` and a log line instead.
    """

    def __init__(self, **kwargs):
        kwargs.setdefault("read_only", True)
        super().__init__(**kwargs)

    def to_representation(self, value):
        if not value:
            return None
        # CloudinaryResource in normal operation; be tolerant of a raw public id.
        build_url = getattr(value, "build_url", None)
        if build_url is None:
            return str(value)
        try:
            return build_url(secure=True)
        except Exception:
            logger.warning(
                "Could not build a Cloudinary URL for %r; is CLOUDINARY_URL set?",
                value,
                exc_info=True,
            )
            return None
