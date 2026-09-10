import { useEffect } from "react";

import Icon from "../../components/Icon";
import SafeImage from "../../components/SafeImage";
import { formatMonthYear } from "../../utils/dates";

/**
 * Full-size view of one gallery photo. Only shows real fields (image,
 * caption, county, upload date) -- the reference design's modal also showed
 * a photographer byline, which isn't backed by any field and was dropped
 * rather than invented.
 */
export default function Lightbox({ image, onClose }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!image) return null;
  const dateLabel = formatMonthYear(image.uploaded_at);

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-on-surface/70 backdrop-blur-sm"
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="bg-surface rounded-2xl max-w-3xl w-full shadow-2xl relative overflow-hidden"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-space-md right-space-md z-10 p-space-xs rounded-full bg-surface/90 text-on-surface-variant hover:text-on-surface shadow-sm"
        >
          <Icon name="close" className="text-[24px]" />
        </button>

        <div className="relative aspect-[4/3] bg-surface-dim">
          <SafeImage
            src={image.image}
            alt={image.caption || "Gallery photograph"}
            className="w-full h-full object-cover"
          />
        </div>

        {(image.caption || image.county || dateLabel) && (
          <div className="p-space-lg flex flex-col gap-space-xs">
            {image.caption && (
              <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                {image.caption}
              </p>
            )}
            {(image.county || dateLabel) && (
              <div className="flex items-center gap-space-sm font-label-sm text-label-sm text-on-surface-variant">
                {image.county && (
                  <span className="flex items-center gap-1">
                    <Icon name="place" className="text-[16px]" />
                    {image.county}
                  </span>
                )}
                {dateLabel && <span>{dateLabel}</span>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
