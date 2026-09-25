from django.db import models


class ContactSubmission(models.Model):
    """A message sent through the public contact form."""

    class InvolvementInterest(models.TextChoices):
        PRAYER = "prayer", "Prayer"
        FIELD = "field", "Field"
        MEDIA = "media", "Media"
        PARTNERSHIP = "partnership", "Partnership"
        OTHER = "other", "Other"

    name = models.CharField(max_length=150)
    email = models.EmailField()
    message = models.TextField()
    involvement_interest = models.CharField(
        max_length=20, choices=InvolvementInterest.choices, blank=True
    )
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-submitted_at"]

    def __str__(self):
        return f"{self.name} <{self.email}>"
