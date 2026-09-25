import { useState } from "react";

import { getGalleryImages } from "../api/endpoints";
import Icon from "../components/Icon";
import { useCategoryFilter } from "../hooks/useCategoryFilter";
import { useFetch } from "../hooks/useFetch";
import CategoryFilterPills from "./Gallery/CategoryFilterPills";
import EthicsCallout from "./Gallery/EthicsCallout";
import GalleryCard, { GalleryCardSkeleton } from "./Gallery/GalleryCard";
import Lightbox from "./Gallery/Lightbox";

export default function Gallery() {
  const { data, error, loading } = useFetch(() => getGalleryImages());
  const { items: images, categoryCounts, selectedCategory, setSelectedCategory, filteredItems: filteredImages } =
    useCategoryFilter(data);
  const [openImage, setOpenImage] = useState(null);

  const showEmptyState = !loading && (error || images.length === 0);

  return (
    <div className="flex flex-col w-full">
      <section className="w-full bg-surface-container-low py-space-xl">
        <div className="max-w-[1320px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop flex flex-col gap-space-lg">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-xs">
              <span className="w-2 h-2 rounded-full bg-primary inline-block" />
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest">
                Mission Monday Visual Archive
              </span>
            </div>
            <h1 className="font-display text-headline-lg text-on-surface">
              Visual Chronicles of Grace
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
              Honoring God's redemptive work through reverent visual storytelling, documenting
              faith, fellowship, and everyday life across the communities we serve.
            </p>
          </div>

          {!showEmptyState && (
            <CategoryFilterPills
              categoryCounts={categoryCounts}
              totalCount={images.length}
              selectedCategory={selectedCategory}
              onSelect={setSelectedCategory}
            />
          )}
        </div>
      </section>

      <main className="w-full py-space-2xl">
        <div className="max-w-[1320px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
          {showEmptyState ? (
            <div className="flex flex-col items-center text-center gap-space-sm py-space-3xl bg-surface-container-low rounded-xl">
              <Icon name="photo_camera" className="text-[40px] text-outline" />
              <h2 className="font-headline-sm text-headline-sm text-on-surface">
                New photographs, added as they're documented in the field
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
                Check back soon as our field team documents more of God's work.
              </p>
            </div>
          ) : filteredImages.length === 0 && !loading ? (
            <div className="flex flex-col items-center text-center gap-space-sm py-space-3xl bg-surface-container-low rounded-xl">
              <Icon name="filter_alt_off" className="text-[40px] text-outline" />
              <p className="font-body-md text-body-md text-on-surface-variant">
                No published photographs in this category yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <GalleryCardSkeleton key={i} />)
                : filteredImages.map((image) => (
                    <GalleryCard key={image.id} image={image} onOpen={setOpenImage} />
                  ))}
            </div>
          )}

          <EthicsCallout />
        </div>
      </main>

      <Lightbox image={openImage} onClose={() => setOpenImage(null)} />
    </div>
  );
}
