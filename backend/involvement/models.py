from django.db import models


class GetInvolvedSubmission(models.Model):
    """A message sent through the public "get involved" form."""

    name = models.CharField(max_length=150)
    email = models.EmailField()
    message = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-submitted_at"]

    def __str__(self):
        return f"{self.name} <{self.email}>"


class GetInvolvedLink(models.Model):
    """An outbound link (donate, social, email) on the get-involved page."""

    class LinkType(models.TextChoices):
        DONATE = "donate", "Donate"
        SOCIAL = "social", "Social"
        EMAIL = "email", "Email"

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    link_type = models.CharField(max_length=20, choices=LinkType.choices)
    url = models.URLField(max_length=500)
    display_order = models.IntegerField(default=0)

    class Meta:
        ordering = ["display_order", "id"]

    def __str__(self):
        return f"{self.get_link_type_display()}: {self.title}"
