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
