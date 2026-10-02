import { Link } from "react-router-dom";

import { getGalleryImages, getTestimonials } from "../../api/endpoints";
import Icon from "../../components/Icon";
import { useFetch } from "../../hooks/useFetch";

// Shown while loading, or if there's no published testimonial yet / the
// fetch fails -- a Bible verse, not attributed to a real person.
const FALLBACK_TESTIMONIAL = {
  quote:
    "If you confess with your mouth the Lord Jesus and believe in your heart that God has raised Him from the dead, you will be saved",
  author_name: "Romans 10:9",
  author_role: "",
};

const BACKGROUND_PHOTO_INDEX = 3;

export default function Testimonial() {
  const { data, error, loading } = useFetch(() => getTestimonials());
  const featured = (data || [])[0] || null;
  const showFallback = !loading && (error || !featured);
  const testimonial = loading ? null : showFallback ? FALLBACK_TESTIMONIAL : featured;
  const initial = testimonial?.author_name?.charAt(0)?.toUpperCase() || "?";

  // Card backdrop: a gallery photo, preferring one past the three that
  // PhotoPreview already shows just above. Until a photo exists the card
  // keeps its plain surface tone and dark text.
  const { data: galleryData } = useFetch(() => getGalleryImages());
  const photos = (galleryData || []).filter((image) => image.image);
  const photo = (photos[BACKGROUND_PHOTO_INDEX] || photos[0])?.image || null;
  const headingColor = photo ? "text-surface-container-lowest" : "text-on-surface";

  return (
    <section className="w-full py-space-3xl md:py-space-4xl bg-surface relative overflow-hidden">
      <div className="w-full max-w-[1320px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
        <div className="relative overflow-hidden bg-surface-container-high rounded-2xl p-space-xl md:p-space-3xl flex flex-col lg:flex-row items-center justify-between gap-space-2xl">
          {photo && (
            <div className="absolute inset-0 z-0">
              <img
                src={photo}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-on-background/90 via-on-background/75 to-on-background/50" />
            </div>
          )}

          <div className="relative z-10 max-w-2xl w-full">
            <div
              className={`flex items-center gap-space-xs font-label-md text-label-md uppercase tracking-wider mb-space-xs ${
                photo ? "text-surface-container-lowest/80" : "text-primary"
              }`}
            >
              <Icon name="format_quote" className="text-[18px]" />
              <span>Voices from the Field</span>
            </div>

            {loading ? (
              <div className="flex flex-col gap-space-sm animate-pulse">
                <div className="h-6 w-full bg-surface-container-highest rounded" />
                <div className="h-6 w-2/3 bg-surface-container-highest rounded" />
              </div>
            ) : (
              <p className={`font-headline-md text-headline-md italic leading-snug ${headingColor}`}>
                &ldquo;{testimonial.quote}&rdquo;
              </p>
            )}

            <div className="mt-space-lg flex items-center gap-space-md">
              <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-headline-sm font-bold shadow-sm shrink-0">
                {loading ? "" : initial}
              </div>
              <div>
                <div className={`font-headline-sm text-headline-sm leading-none ${headingColor}`}>
                  {loading ? "" : testimonial.author_name}
                </div>
                {!loading && testimonial.author_role && (
                  <div
                    className={`font-body-sm text-body-sm mt-space-xxs ${
                      photo ? "text-surface-container-lowest/80" : "text-on-surface-variant"
                    }`}
                  >
                    {testimonial.author_role}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="relative z-10 w-full lg:w-auto shrink-0 flex flex-col sm:flex-row lg:flex-col gap-space-md">
            <Link
              to="/about"
              className="inline-flex items-center justify-center px-space-xl py-space-md bg-surface-container-lowest text-on-surface font-label-lg text-label-lg rounded-lg shadow-sm hover:bg-surface transition-all text-center"
            >
              Learn About Our Calling
            </Link>
            <Link
              to="/contact#find-us"
              className="inline-flex items-center justify-center px-space-xl py-space-md bg-primary-container text-on-primary font-label-lg text-label-lg rounded-lg shadow-md hover:bg-primary transition-all text-center"
            >
              Visit Our Office
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
