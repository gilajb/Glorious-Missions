"""Data migration: copy each gallery entry's legacy single `image` into the
new GalleryPhoto set, so existing content keeps its cover photo after the
model change in 0003.

This only copies the Cloudinary reference (public_id/URL) already stored on
the row -- no re-upload, no Cloudinary API calls, no risk to the file.
"""

from django.db import migrations


def backfill(apps, schema_editor):
    GalleryImage = apps.get_model("gallery", "GalleryImage")
    GalleryPhoto = apps.get_model("gallery", "GalleryPhoto")

    for entry in GalleryImage.objects.all():
        if entry.image:
            GalleryPhoto.objects.create(gallery_image=entry, image=entry.image, order=0)


def noop_reverse(apps, schema_editor):
    # Nothing to undo: reversing 0003 drops the GalleryPhoto table outright.
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("gallery", "0003_galleryimage_video_url_galleryphoto"),
    ]

    operations = [
        migrations.RunPython(backfill, noop_reverse),
    ]
