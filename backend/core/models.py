from cloudinary.models import CloudinaryField
from django.db import models


class SiteContent(models.Model):
    """An editable block of copy for one of the static pages."""

    class Section(models.TextChoices):
        HOME = "home", "Home"
        ABOUT = "about", "About"

    section = models.CharField(max_length=20, choices=Section.choices)
    title = models.CharField(max_length=200)
    body = models.TextField(blank=True)
    image = CloudinaryField("image", blank=True, null=True)
    published = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "site content block"
        verbose_name_plural = "site content blocks"
        ordering = ["section", "id"]

    def __str__(self):
        return f"{self.get_section_display()} - {self.title}"


class TeamMember(models.Model):
    """A person on the About page's "Leadership & Field Partners" grid."""

    name = models.CharField(max_length=150)
    role = models.CharField(max_length=150)
    bio = models.TextField(blank=True)
    location = models.CharField(max_length=150, blank=True)
    image = CloudinaryField("image", blank=True, null=True)
    display_order = models.IntegerField(default=0)
    published = models.BooleanField(default=False)

    class Meta:
        ordering = ["display_order", "id"]

    def __str__(self):
        return f"{self.name} ({self.role})"


class Testimonial(models.Model):
    """A quote shown in a testimonial block (currently Home's closing section)."""

    quote = models.TextField()
    author_name = models.CharField(max_length=150)
    author_role = models.CharField(max_length=200, blank=True)
    published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.author_name} - {self.quote[:40]}"
