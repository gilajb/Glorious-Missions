import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { ApiError } from "../../api/client";
import {
  addGalleryPhoto,
  deleteGalleryEntry,
  deleteGalleryPhoto,
  getAdminGalleryEntry,
  reorderGalleryPhoto,
  toggleGalleryPublish,
  updateGalleryEntry,
} from "../../api/endpoints";
import { CATEGORIES } from "../../hooks/useCategoryFilter";
import { useAuth } from "../AuthContext";
import PhotoUploader from "../components/PhotoUploader";

function actionErrorMessage(err) {
  return err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
}

/** "2022-05-14T12:00:00Z" -> "2022-05-14", the format <input type="date"> expects. */
function toDateInputValue(isoString) {
  return isoString ? isoString.slice(0, 10) : "";
}

const INPUT_CLASS =
  "px-space-md py-space-sm rounded-lg bg-surface border border-outline-variant font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary";

/**
 * A gallery entry has no fields of its own beyond its photos and publish
 * state -- the gallery is a pure photo collection (see the Mission Monday
 * form for a content type with text/video/article). So there's no
 * create-mode form here: GalleryManager creates an empty entry and routes
 * straight into this edit view.
 */
export default function GalleryForm() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [entry, setEntry] = useState(null);
  const [dateValue, setDateValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState(null);

  const applyEntry = (data) => {
    setEntry(data);
    setDateValue(toDateInputValue(data.uploaded_at));
  };

  useEffect(() => {
    let cancelled = false;
    getAdminGalleryEntry(id, token).then((data) => {
      if (!cancelled) applyEntry(data);
    });
    return () => {
      cancelled = true;
    };
  }, [id, token]);

  const refresh = async () => applyEntry(await getAdminGalleryEntry(id, token));

  const handleAddPhoto = (file) => addGalleryPhoto(id, file, token).then(refresh);
  const handleRemovePhoto = (photoId) => deleteGalleryPhoto(photoId, token).then(refresh);
  const handleMovePhoto = async (photoId, direction, currentPhotos) => {
    const index = currentPhotos.findIndex((p) => p.id === photoId);
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= currentPhotos.length) return;
    const current = currentPhotos[index];
    const other = currentPhotos[swapIndex];
    await reorderGalleryPhoto(current.id, other.order, token);
    await reorderGalleryPhoto(other.id, current.order, token);
    await refresh();
  };

  const handleCategoryChange = async (event) => {
    setBusy(true);
    setActionError(null);
    try {
      await updateGalleryEntry(id, { category: event.target.value }, token);
      await refresh();
    } catch (err) {
      setActionError(actionErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  // Saved on blur rather than on change: typing a year into a date input
  // fires change events for intermediate values (0002, 0020, ...).
  const handleDateCommit = async () => {
    const current = toDateInputValue(entry.uploaded_at);
    if (dateValue === current) return;
    if (!dateValue) {
      setDateValue(current);
      return;
    }
    setBusy(true);
    setActionError(null);
    try {
      // Noon UTC keeps the same calendar day in every visitor's timezone.
      await updateGalleryEntry(id, { uploaded_at: `${dateValue}T12:00:00Z` }, token);
      await refresh();
    } catch (err) {
      setActionError(actionErrorMessage(err));
      setDateValue(current);
    } finally {
      setBusy(false);
    }
  };

  const handleTogglePublish = async () => {
    setBusy(true);
    setActionError(null);
    try {
      await toggleGalleryPublish(id, token);
      await refresh();
    } catch (err) {
      setActionError(actionErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this gallery entry? This cannot be undone.")) return;
    setBusy(true);
    setActionError(null);
    try {
      await deleteGalleryEntry(id, token);
      navigate("/admin/gallery");
    } catch (err) {
      setActionError(actionErrorMessage(err));
      setBusy(false);
    }
  };

  if (!entry) {
    return <p className="font-body-md text-body-md text-on-surface-variant">Loading…</p>;
  }

  return (
    <div className="max-w-2xl flex flex-col gap-space-lg">
      <div className="flex items-center justify-between">
        <h1 className="font-headline-md text-headline-md text-on-surface">Gallery entry</h1>
        <Link
          to="/admin/gallery"
          className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface"
        >
          Back to gallery
        </Link>
      </div>

      {actionError && (
        <p role="alert" className="font-body-sm text-body-sm text-error">
          {actionError}
        </p>
      )}

      <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
        <div className="flex items-start justify-between gap-space-md">
          <div className="flex flex-wrap gap-space-md">
            <label className="flex flex-col gap-space-xxs">
              <span className="font-label-md text-label-md text-on-surface">Category</span>
              <select
                value={entry.category}
                onChange={handleCategoryChange}
                disabled={busy}
                className={INPUT_CLASS}
              >
                {CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-space-xxs">
              <span className="font-label-md text-label-md text-on-surface">Photo date</span>
              <input
                type="date"
                value={dateValue}
                max={toDateInputValue(new Date().toISOString())}
                onChange={(event) => setDateValue(event.target.value)}
                onBlur={handleDateCommit}
                disabled={busy}
                className={INPUT_CLASS}
              />
            </label>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            {entry.published ? "Published" : "Draft"}
          </span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          The date shows on the site as month and year. Change it for older photos.
        </p>

        <div className="flex items-center justify-between">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Photos</h2>
        </div>
        <PhotoUploader
          photos={entry.photos}
          onAdd={handleAddPhoto}
          onRemove={handleRemovePhoto}
          onMove={handleMovePhoto}
        />
      </div>

      <div className="flex items-center gap-space-sm">
        <button
          type="button"
          disabled={busy}
          onClick={handleTogglePublish}
          className="inline-flex items-center px-space-lg py-space-sm bg-primary-container text-on-primary font-label-lg text-label-lg rounded-lg shadow-sm hover:opacity-95 disabled:opacity-60"
        >
          {entry.published ? "Unpublish" : "Publish"}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={handleDelete}
          className="inline-flex items-center px-space-lg py-space-sm text-error font-label-lg text-label-lg rounded-lg hover:bg-error-container/40 disabled:opacity-60"
        >
          Delete entry
        </button>
      </div>
    </div>
  );
}
