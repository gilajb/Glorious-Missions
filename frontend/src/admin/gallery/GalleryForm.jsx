import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  addGalleryPhoto,
  deleteGalleryEntry,
  deleteGalleryPhoto,
  getAdminGalleryEntry,
  reorderGalleryPhoto,
  toggleGalleryPublish,
} from "../../api/endpoints";
import { useAuth } from "../AuthContext";
import PhotoUploader from "../components/PhotoUploader";

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
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getAdminGalleryEntry(id, token).then((data) => {
      if (!cancelled) setEntry(data);
    });
    return () => {
      cancelled = true;
    };
  }, [id, token]);

  const refresh = async () => setEntry(await getAdminGalleryEntry(id, token));

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

  const handleTogglePublish = async () => {
    setBusy(true);
    try {
      await toggleGalleryPublish(id, token);
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this gallery entry? This cannot be undone.")) return;
    setBusy(true);
    try {
      await deleteGalleryEntry(id, token);
      navigate("/admin/gallery");
    } finally {
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

      <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Photos</h2>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            {entry.published ? "Published" : "Draft"}
          </span>
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
