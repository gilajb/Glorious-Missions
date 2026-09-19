import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ApiError } from "../../api/client";
import {
  addGalleryPhoto,
  createGalleryEntry,
  deleteGalleryPhoto,
  getAdminGalleryEntry,
  reorderGalleryPhoto,
  updateGalleryEntry,
} from "../../api/endpoints";
import { useAuth } from "../AuthContext";
import PhotoUploader from "../components/PhotoUploader";
import TextField from "../components/TextField";
import VideoUrlField from "../components/VideoUrlField";

export default function GalleryForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { token } = useAuth();
  const navigate = useNavigate();

  const [caption, setCaption] = useState("");
  const [county, setCounty] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [photos, setPhotos] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditing);

  useEffect(() => {
    if (!isEditing) return;
    let cancelled = false;
    getAdminGalleryEntry(id, token).then((entry) => {
      if (cancelled) return;
      setCaption(entry.caption || "");
      setCounty(entry.county || "");
      setVideoUrl(entry.video_url || "");
      setPhotos(entry.photos);
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
    const payload = { caption, county, video_url: videoUrl };

    try {
      if (isEditing) {
        await updateGalleryEntry(id, payload, token);
        navigate("/admin/gallery");
      } else {
        const created = await createGalleryEntry(payload, token);
        navigate(`/admin/gallery/${created.id}/edit`, { replace: true });
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
    const entry = await getAdminGalleryEntry(id, token);
    setPhotos(entry.photos);
  };

  const handleAddPhoto = (file) => addGalleryPhoto(id, file, token).then(refreshPhotos);
  const handleRemovePhoto = (photoId) => deleteGalleryPhoto(photoId, token).then(refreshPhotos);
  const handleMovePhoto = async (photoId, direction, currentPhotos) => {
    const index = currentPhotos.findIndex((p) => p.id === photoId);
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= currentPhotos.length) return;
    const current = currentPhotos[index];
    const other = currentPhotos[swapIndex];
    await reorderGalleryPhoto(current.id, other.order, token);
    await reorderGalleryPhoto(other.id, current.order, token);
    await refreshPhotos();
  };

  if (loading) {
    return <p className="font-body-md text-body-md text-on-surface-variant">Loading…</p>;
  }

  return (
    <div className="max-w-2xl flex flex-col gap-space-lg">
      <h1 className="font-headline-md text-headline-md text-on-surface">
        {isEditing ? "Edit gallery entry" : "New gallery entry"}
      </h1>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-space-md bg-surface-container-lowest rounded-xl p-space-lg shadow-sm"
      >
        <TextField id="gallery-caption" label="Caption" value={caption} onChange={setCaption} error={fieldErrors.caption} />
        <TextField
          id="gallery-county"
          label="County (optional)"
          value={county}
          onChange={setCounty}
          error={fieldErrors.county}
        />
        <VideoUrlField id="gallery-video" value={videoUrl} onChange={setVideoUrl} error={fieldErrors.video_url} />

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
