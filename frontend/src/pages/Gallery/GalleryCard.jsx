import Icon from "../../components/Icon";
import SafeImage from "../../components/SafeImage";
import { CATEGORIES } from "../../hooks/useCategoryFilter";
import { formatMonthYear } from "../../utils/dates";

function categoryLabel(value) {
  return CATEGORIES.find((category) => category.value === value)?.label;
}

export default function GalleryCard({ image, onOpen }) {
  const dateLabel = formatMonthYear(image.uploaded_at);
  const categoryName = categoryLabel(image.category);

  return (
    <article className="flex flex-col bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <button
        type="button"
        onClick={() => onOpen(image)}
        className="relative aspect-[4/3] bg-surface-dim overflow-hidden group text-left"
        aria-label="View larger photograph"
      >
        <SafeImage
          src={image.image}
          alt="Gallery photograph"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {image.photos?.length > 1 && (
          <div className="absolute top-space-sm right-space-sm">
            <span className="inline-flex items-center gap-1 px-space-sm py-space-xxs rounded-full bg-black/50 text-white font-label-sm text-label-sm">
              <Icon name="photo_library" className="text-[14px]" />
              {image.photos.length}
            </span>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
          <Icon
            name="zoom_in"
            className="text-[28px] text-white opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </div>
      </button>

      {(categoryName || dateLabel) && (
        <div className="p-space-lg flex items-center justify-between gap-space-sm">
          {categoryName && (
            <span className="px-space-xs py-space-xxs rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
              {categoryName}
            </span>
          )}
          {dateLabel && (
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              {dateLabel}
            </span>
          )}
        </div>
      )}
    </article>
  );
}

export function GalleryCardSkeleton() {
  return (
    <div className="flex flex-col bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-[4/3] bg-surface-dim" />
      <div className="p-space-lg flex flex-col gap-space-xs">
        <div className="h-4 w-full bg-surface-container rounded" />
        <div className="h-3 w-1/3 bg-surface-container rounded" />
      </div>
    </div>
  );
}
