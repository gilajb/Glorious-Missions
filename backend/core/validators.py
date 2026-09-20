"""Shared model/serializer validators."""

import re

from django.core.exceptions import ValidationError

_VIDEO_URL_PATTERN = re.compile(
    r"^https?://"
    r"(www\.)?"
    r"("
    r"youtube\.com/(watch\?v=|shorts/)[\w-]+"
    r"|youtu\.be/[\w-]+"
    r"|vimeo\.com/\d+"
    r")"
    r"([/?].*)?$",
    re.IGNORECASE,
)


def validate_video_url(value):
    """Only YouTube/Vimeo watch/share links are accepted, so the frontend can
    safely turn the URL into an embed without a wider allow-list."""
    if not value:
        return
    if not _VIDEO_URL_PATTERN.match(value):
        raise ValidationError(
            "Enter a YouTube (youtube.com/watch?v=..., youtu.be/...) "
            "or Vimeo (vimeo.com/...) video URL."
        )


MAX_IMAGE_UPLOAD_SIZE = 10 * 1024 * 1024  # 10 MB


def validate_image_file_size(value):
    """Caps a single photo upload so one staff request (or a compromised
    staff token) can't consume unbounded server/Cloudinary resources."""
    if value.size > MAX_IMAGE_UPLOAD_SIZE:
        raise ValidationError(
            f"Image must be {MAX_IMAGE_UPLOAD_SIZE // (1024 * 1024)}MB or smaller."
        )
