import { useEffect, useState } from "react";

import Icon from "../../components/Icon";
import SafeImage from "../../components/SafeImage";
import VideoEmbed from "../../components/VideoEmbed";
import { formatMonthYear } from "../../utils/dates";

/**
 * Full-size view of one gallery photo. Only shows real fields (image,
 * caption, county, upload date) -- the reference design's modal also showed
 * a photographer byline, which isn't backed by any field and was dropped
 * rather than invented.
 */
export default function Lightbox({ image, onClose }) {
  const [photoIndex, setPhotoIndex] = useState(0);
  // A new entry may open while the lightbox is already mounted (clicking
  // another card without it fully unmounting) -- always start at photo 0.
  // Adjusted during render rather than in an effect, per
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [lastImageId, setLastImageId] = useState(image?.id);
  if (image?.id !== lastImageId) {
    setLastImageId(image?.id);
    setPhotoIndex(0);
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!image) return null;
  const dateLabel = formatMonthYear(image.uploaded_at);
  const photos = image.photos?.length ? image.photos : image.image ? [{ id: "legacy", image: image.image }] : [];
  const currentPhoto = photos[photoIndex] || photos[0];

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
            src={currentPhoto?.image}
            alt={image.caption || "Gallery photograph"}
            className="w-full h-full object-cover"
          />
          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setPhotoIndex((i) => (i - 1 + photos.length) % photos.length)}
                aria-label="Previous photo"
                className="absolute left-space-sm top-1/2 -translate-y-1/2 p-space-xs rounded-full bg-surface/90 text-on-surface-variant hover:text-on-surface shadow-sm"
              >
                <Icon name="chevron_left" className="text-[24px]" />
              </button>
              <button
                type="button"
                onClick={() => setPhotoIndex((i) => (i + 1) % photos.length)}
                aria-label="Next photo"
                className="absolute right-space-sm top-1/2 -translate-y-1/2 p-space-xs rounded-full bg-surface/90 text-on-surface-variant hover:text-on-surface shadow-sm"
              >
                <Icon name="chevron_right" className="text-[24px]" />
              </button>
              <span className="absolute bottom-space-sm left-1/2 -translate-x-1/2 px-space-sm py-space-xxs rounded-full bg-black/50 text-white font-label-sm text-label-sm">
                {photoIndex + 1} / {photos.length}
              </span>
            </>
          )}
        </div>

        {image.video_url && <VideoEmbed url={image.video_url} title={image.caption || "Gallery video"} />}

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
