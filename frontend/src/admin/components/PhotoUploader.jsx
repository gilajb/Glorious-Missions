import { useRef, useState } from "react";

import Icon from "../../components/Icon";
import SafeImage from "../../components/SafeImage";

/**
 * Add/remove/reorder photos for one Gallery entry or Mission Monday post.
 *
 * Uploads happen one file at a time (not one batched request) so a slow or
 * cold-started backend request doesn't block the rest, and a partial
 * failure only loses the one file that failed -- see the admin portal's
 * upload UX notes.
 *
 * @param {object[]} photos - [{id, image_url, order}], already in display order
 * @param {(file: File) => Promise<any>} onAdd
 * @param {(photoId: number) => Promise<any>} onRemove
 * @param {(photoId: number, direction: "up"|"down", photos: object[]) => Promise<any>} onMove
 */
export default function PhotoUploader({ photos, onAdd, onRemove, onMove }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const handleFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = ""; // allow re-selecting the same file later
    if (files.length === 0) return;

    setBusy(true);
    setError(null);
    for (const file of files) {
      try {
        // eslint-disable-next-line no-await-in-loop -- sequential by design
        await onAdd(file);
      } catch {
        setError(`Couldn't upload "${file.name}". Please try again.`);
      }
    }
    setBusy(false);
  };

  const handleRemove = async (photoId) => {
    setError(null);
    try {
      await onRemove(photoId);
    } catch {
      setError("Couldn't remove that photo. Please try again.");
    }
  };

  const handleMove = async (photoId, direction) => {
    setError(null);
    try {
      await onMove(photoId, direction, photos);
    } catch {
      setError("Couldn't reorder photos. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-space-sm">
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-sm">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="relative aspect-square rounded-lg overflow-hidden bg-surface-container group"
            >
              <SafeImage src={photo.image_url} alt="" className="w-full h-full object-cover" />

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-start justify-end p-1 gap-1 opacity-0 group-hover:opacity-100">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => handleMove(photo.id, "up")}
                  aria-label="Move earlier"
                  className="p-1 rounded-full bg-surface/90 text-on-surface disabled:opacity-40"
                >
                  <Icon name="arrow_back" className="text-[16px]" />
                </button>
                <button
                  type="button"
                  disabled={index === photos.length - 1}
                  onClick={() => handleMove(photo.id, "down")}
                  aria-label="Move later"
                  className="p-1 rounded-full bg-surface/90 text-on-surface disabled:opacity-40"
                >
                  <Icon name="arrow_forward" className="text-[16px]" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(photo.id)}
                  aria-label="Remove photo"
                  className="p-1 rounded-full bg-surface/90 text-error"
                >
                  <Icon name="delete" className="text-[16px]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center justify-center gap-space-xs px-space-md py-space-sm border-2 border-dashed border-outline-variant rounded-lg text-on-surface-variant hover:border-primary hover:text-primary transition-colors disabled:opacity-60"
      >
        <Icon name="add_photo_alternate" className="text-[20px]" />
        {busy ? "Uploading…" : "Add photos"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        className="hidden"
      />

      {error && (
        <p role="alert" className="font-body-sm text-body-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}
