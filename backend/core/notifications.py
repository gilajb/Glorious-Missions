"""Email notifications for public form submissions.

Sending must never turn a successful submission into a failed API response, so
every failure here is logged and swallowed.
"""

import logging

from django.conf import settings
from django.core.mail import send_mail

logger = logging.getLogger(__name__)


def notify_new_submission(submission, *, form_name):
    """Email NOTIFY_EMAIL about a new contact / get-involved submission.

    Returns True if the message was handed to the email backend, else False.
    Never raises.
    """
    recipient = getattr(settings, "NOTIFY_EMAIL", "")
    if not recipient:
        logger.warning(
            "NOTIFY_EMAIL is not set; skipping notification for %s submission #%s",
            form_name,
            submission.pk,
        )
        return False

    subject = f"New {form_name} submission from {submission.name}"
    involvement = getattr(submission, "involvement_interest", "") or ""
    involvement_line = f"Interest: {involvement.title()}\n" if involvement else ""
    body = (
        f"A new {form_name} submission was received.\n\n"
        f"Name:    {submission.name}\n"
        f"Email:   {submission.email}\n"
        f"{involvement_line}"
        f"Sent at: {submission.submitted_at:%Y-%m-%d %H:%M %Z}\n\n"
        f"Message:\n{submission.message}\n"
    )

    try:
        send_mail(
            subject=subject,
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[recipient],
            fail_silently=False,
        )
    except Exception:
        logger.exception(
            "Failed to send notification email for %s submission #%s",
            form_name,
            submission.pk,
        )
        return False

    logger.info("Sent %s notification for submission #%s", form_name, submission.pk)
    return True
