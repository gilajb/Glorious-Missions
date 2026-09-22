import { Link } from "react-router-dom";

import { getGalleryImages } from "../../api/endpoints";
import Icon from "../../components/Icon";
import SafeImage from "../../components/SafeImage";
import { useFetch } from "../../hooks/useFetch";
import { formatMonthYear } from "../../utils/dates";

const PREVIEW_COUNT = 3;

function PhotoCard({ image }) {
  const uploadedLabel = formatMonthYear(image.uploaded_at);
  return (
    <div className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden">
        <SafeImage
          src={image.image}
          alt="Gallery photograph"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      {uploadedLabel && (
        <div className="p-space-lg text-on-surface-variant font-label-sm text-label-sm">
          {uploadedLabel}
        </div>
      )}
    </div>
  );
}

function PhotoCardSkeleton() {
  return (
    <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm flex flex-col animate-pulse">
      <div className="aspect-[4/3] bg-surface-container-high" />
      <div className="p-space-lg flex flex-col gap-space-xs">
        <div className="h-4 w-2/3 bg-surface-container-high rounded" />
        <div className="h-3 w-1/3 bg-surface-container-high rounded" />
      </div>
    </div>
  );
}

export default function PhotoPreview() {
  const { data, error, loading } = useFetch(() => getGalleryImages());
  const images = (data || []).slice(0, PREVIEW_COUNT);
  const showEmptyState = !loading && (error || images.length === 0);

  return (
    <section className="w-full py-space-3xl md:py-space-4xl bg-surface">
      <div className="w-full max-w-[1320px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-space-2xl gap-space-md">
          <div>
            <span className="font-label-md text-label-md text-secondary tracking-widest uppercase block mb-space-xxs">
              Authentic Documentation
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              Moments of Grace Captured
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs max-w-xl">
              Through the lens of Glorious Photography Pictures, we document faith and fellowship
              without sensationalism, preserving cultural reverence.
            </p>
          </div>
          <Link
            to="/gallery"
            className="inline-flex items-center gap-space-xs font-label-lg text-label-lg text-primary hover:text-primary-container font-semibold transition-colors"
          >
            <span>View Full Photo Archive</span>
            <Icon name="arrow_forward" className="text-[18px]" />
          </Link>
        </div>

        {showEmptyState ? (
          <div className="flex flex-col items-center text-center gap-space-xs py-space-2xl bg-surface-container-low rounded-xl">
            <Icon name="photo_camera" className="text-[32px] text-outline" />
            <p className="font-body-md text-body-md text-on-surface-variant">
              New photos are on their way. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
            {loading
              ? Array.from({ length: PREVIEW_COUNT }).map((_, i) => <PhotoCardSkeleton key={i} />)
              : images.map((image) => <PhotoCard key={image.id} image={image} />)}
          </div>
        )}
      </div>
    </section>
  );
}
