import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ApiError } from "../../api/client";
import {
  addMissionPhoto,
  createMission,
  deleteMissionPhoto,
  getAdminMission,
  reorderMissionPhoto,
  updateMission,
} from "../../api/endpoints";
import { useAuth } from "../AuthContext";
import PhotoUploader from "../components/PhotoUploader";
import RichTextEditor from "../components/RichTextEditor";
import TextField from "../components/TextField";
import VideoUrlField from "../components/VideoUrlField";

const EMPTY = {
  title: "",
  summary: "",
  article: "",
  county: "",
  start_date: "",
  end_date: "",
  video_url: "",
  publish_date: "",
};

export default function MissionMondayForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { token } = useAuth();
  const navigate = useNavigate();

  const [values, setValues] = useState(EMPTY);
  const [photos, setPhotos] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditing);

  const setField = (field) => (value) => setValues((prev) => ({ ...prev, [field]: value }));

  useEffect(() => {
    if (!isEditing) return;
    let cancelled = false;
    getAdminMission(id, token).then((mission) => {
      if (cancelled) return;
      setValues({
        title: mission.title || "",
        summary: mission.summary || "",
        article: mission.article || "",
        county: mission.county || "",
        start_date: mission.start_date || "",
        end_date: mission.end_date || "",
        video_url: mission.video_url || "",
        publish_date: mission.publish_date || "",
      });
      setPhotos(mission.photos);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [id, isEditing, token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFormError(null);
    setFieldErrors({});

    const payload = {
      ...values,
      start_date: values.start_date || null,
      end_date: values.end_date || null,
      publish_date: values.publish_date || undefined,
    };

    try {
      if (isEditing) {
        await updateMission(id, payload, token);
        navigate("/admin/mission-mondays");
      } else {
        const created = await createMission(payload, token);
        navigate(`/admin/mission-mondays/${created.id}/edit`, { replace: true });
      }
    } catch (err) {
      setSaving(false);
      if (err instanceof ApiError && err.kind === "validation") {
        setFieldErrors(err.fieldErrors || {});
        setFormError("Please fix the highlighted fields.");
      } else if (err instanceof ApiError) {
        setFormError(err.message);
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    }
  };

  const refreshPhotos = async () => {
    const mission = await getAdminMission(id, token);
    setPhotos(mission.photos);
  };

  const handleAddPhoto = (file) => addMissionPhoto(id, file, token).then(refreshPhotos);
  const handleRemovePhoto = (photoId) => deleteMissionPhoto(photoId, token).then(refreshPhotos);
  const handleMovePhoto = async (photoId, direction, currentPhotos) => {
    const index = currentPhotos.findIndex((p) => p.id === photoId);
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= currentPhotos.length) return;
    const current = currentPhotos[index];
    const other = currentPhotos[swapIndex];
    await reorderMissionPhoto(current.id, other.order, token);
    await reorderMissionPhoto(other.id, current.order, token);
    await refreshPhotos();
  };

  if (loading) {
    return <p className="font-body-md text-body-md text-on-surface-variant">Loading…</p>;
  }

  return (
    <div className="max-w-2xl flex flex-col gap-space-lg">
      <h1 className="font-headline-md text-headline-md text-on-surface">
        {isEditing ? "Edit Mission Monday post" : "New Mission Monday post"}
      </h1>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-space-md bg-surface-container-lowest rounded-xl p-space-lg shadow-sm"
      >
        <TextField id="mm-title" label="Title" value={values.title} onChange={setField("title")} error={fieldErrors.title} required />
        <TextField
          id="mm-summary"
          label="Short summary (shown on cards)"
          as="textarea"
          rows={2}
          value={values.summary}
          onChange={setField("summary")}
          error={fieldErrors.summary}
        />

        <div className="flex flex-col gap-space-xxs">
          <span className="font-label-md text-label-md text-on-surface">Full article</span>
          <RichTextEditor value={values.article} onChange={setField("article")} />
          {fieldErrors.article && (
            <p role="alert" className="font-body-sm text-body-sm text-error">
              {fieldErrors.article[0]}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-space-md">
          <TextField id="mm-county" label="County" value={values.county} onChange={setField("county")} error={fieldErrors.county} />
          <TextField
            id="mm-publish-date"
            label="Publish date (this Monday)"
            type="date"
            value={values.publish_date}
            onChange={setField("publish_date")}
            error={fieldErrors.publish_date}
          />
          <TextField
            id="mm-start-date"
            label="Start date (optional)"
            type="date"
            value={values.start_date}
            onChange={setField("start_date")}
            error={fieldErrors.start_date}
          />
          <TextField
            id="mm-end-date"
            label="End date (optional, blank = ongoing)"
            type="date"
            value={values.end_date}
            onChange={setField("end_date")}
            error={fieldErrors.end_date}
          />
        </div>

        <VideoUrlField id="mm-video" value={values.video_url} onChange={setField("video_url")} error={fieldErrors.video_url} />

        {formError && (
          <p role="alert" className="font-body-sm text-body-sm text-error">
            {formError}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="self-start inline-flex items-center px-space-lg py-space-sm bg-primary-container text-on-primary font-label-lg text-label-lg rounded-lg shadow-sm hover:opacity-95 disabled:opacity-60"
        >
          {saving ? "Saving…" : isEditing ? "Save changes" : "Create & add photos"}
        </button>
      </form>

      {isEditing && (
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-sm">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Photos</h2>
          <PhotoUploader
            photos={photos}
            onAdd={handleAddPhoto}
            onRemove={handleRemovePhoto}
            onMove={handleMovePhoto}
          />
        </div>
      )}
    </div>
  );
}
