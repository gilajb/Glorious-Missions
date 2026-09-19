"""Data migration: backfill publish_date and copy each mission's legacy
single `image` into the new MissionPhoto set, so existing content keeps its
relative ordering and its cover photo after the model change in 0003.

This only copies the Cloudinary reference (public_id/URL) already stored on
the row -- no re-upload, no Cloudinary API calls, no risk to the file.
"""

from django.db import migrations


def backfill(apps, schema_editor):
    Mission = apps.get_model("missions", "Mission")
    MissionPhoto = apps.get_model("missions", "MissionPhoto")

    for mission in Mission.objects.all():
        mission.publish_date = mission.created_at.date()
        mission.save(update_fields=["publish_date"])

        if mission.image:
            MissionPhoto.objects.create(mission=mission, image=mission.image, order=0)


def noop_reverse(apps, schema_editor):
    # Nothing to undo: reversing 0003 drops the MissionPhoto table and the
    # publish_date column outright.
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("missions", "0003_alter_mission_options_mission_article_and_more"),
    ]

    operations = [
        migrations.RunPython(backfill, noop_reverse),
    ]
