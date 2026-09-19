import { useState } from "react";
import { Link } from "react-router-dom";

import Icon from "../../components/Icon";
import SafeImage from "../../components/SafeImage";
import { deleteGalleryEntry, getAdminGalleryEntries, toggleGalleryPublish } from "../../api/endpoints";
import { useFetch } from "../../hooks/useFetch";
import { useAuth } from "../AuthContext";

export default function GalleryManager() {
  const { token } = useAuth();
  const { data, loading, error, reload } = useFetch(() => getAdminGalleryEntries(token), [token]);
  const entries = data || [];
  const [busyId, setBusyId] = useState(null);

  const handleTogglePublish = async (id) => {
    setBusyId(id);
    try {
      await toggleGalleryPublish(id, token);
      await reload();
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this gallery entry? This cannot be undone.")) return;
    setBusyId(id);
    try {
      await deleteGalleryEntry(id, token);
      await reload();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="flex flex-col gap-space-lg">
      <div className="flex items-center justify-between">
        <h1 className="font-headline-md text-headline-md text-on-surface">Gallery</h1>
        <Link
          to="/admin/gallery/new"
          className="inline-flex items-center gap-space-xs px-space-md py-space-sm bg-primary-container text-on-primary font-label-lg text-label-lg rounded-lg shadow-sm hover:opacity-95"
        >
          <Icon name="add" className="text-[18px]" />
          New entry
        </Link>
      </div>

      {loading ? (
        <p className="font-body-md text-body-md text-on-surface-variant">Loading…</p>
      ) : error ? (
        <p className="font-body-md text-body-md text-error">Couldn't load gallery entries.</p>
      ) : entries.length === 0 ? (
        <p className="font-body-md text-body-md text-on-surface-variant">No gallery entries yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col"
            >
              <div className="aspect-[4/3] bg-surface-container">
                <SafeImage
                  src={entry.photos[0]?.image_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-space-md flex flex-col gap-space-xs">
                <p className="font-body-md text-body-md text-on-surface truncate">
                  {entry.caption || "Untitled"}
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  {entry.county || "No county"} · {entry.photos.length} photo
                  {entry.photos.length === 1 ? "" : "s"}
                  {!entry.published && " · Draft"}
                </p>
                <div className="flex items-center gap-space-xs pt-space-xs">
                  <Link
                    to={`/admin/gallery/${entry.id}/edit`}
                    className="flex-1 text-center px-space-sm py-space-xs bg-surface-container text-on-surface rounded font-label-md text-label-md hover:bg-surface-container-high"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    disabled={busyId === entry.id}
                    onClick={() => handleTogglePublish(entry.id)}
                    className="flex-1 px-space-sm py-space-xs bg-surface-container text-on-surface rounded font-label-md text-label-md hover:bg-surface-container-high disabled:opacity-60"
                  >
                    {entry.published ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    type="button"
                    disabled={busyId === entry.id}
                    onClick={() => handleDelete(entry.id)}
                    aria-label="Delete"
                    className="px-space-sm py-space-xs text-error rounded hover:bg-error-container/40 disabled:opacity-60"
                  >
                    <Icon name="delete" className="text-[18px]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
