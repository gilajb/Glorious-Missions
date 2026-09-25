import { Link } from "react-router-dom";

import { getTestimonials } from "../../api/endpoints";
import Icon from "../../components/Icon";
import { useFetch } from "../../hooks/useFetch";

// Shown while loading, or if there's no published testimonial yet / the
// fetch fails -- on-brand generic copy, not attributed to a real person.
const FALLBACK_TESTIMONIAL = {
  quote:
    "Our partners consistently share how this ministry's photography and practical care restore dignity to every community it serves.",
  author_name: "Mission Monday",
  author_role: "Field Team",
};

export default function Testimonial() {
  const { data, error, loading } = useFetch(() => getTestimonials());
  const featured = (data || [])[0] || null;
  const showFallback = !loading && (error || !featured);
  const testimonial = loading ? null : showFallback ? FALLBACK_TESTIMONIAL : featured;
  const initial = testimonial?.author_name?.charAt(0)?.toUpperCase() || "?";

  return (
    <section className="w-full py-space-3xl md:py-space-4xl bg-surface relative overflow-hidden">
      <div className="w-full max-w-[1320px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
        <div className="bg-surface-container-high rounded-2xl p-space-xl md:p-space-3xl flex flex-col lg:flex-row items-center justify-between gap-space-2xl">
          <div className="max-w-2xl w-full">
            <div className="flex items-center gap-space-xs text-primary font-label-md text-label-md uppercase tracking-wider mb-space-xs">
              <Icon name="format_quote" className="text-[18px]" />
              <span>Voices from the Field</span>
            </div>

            {loading ? (
              <div className="flex flex-col gap-space-sm animate-pulse">
                <div className="h-6 w-full bg-surface-container-highest rounded" />
                <div className="h-6 w-2/3 bg-surface-container-highest rounded" />
              </div>
            ) : (
              <p className="font-headline-md text-headline-md text-on-surface italic leading-snug">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
            )}

            <div className="mt-space-lg flex items-center gap-space-md">
              <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-headline-sm font-bold shadow-sm shrink-0">
                {loading ? "" : initial}
              </div>
              <div>
                <div className="font-headline-sm text-headline-sm text-on-surface leading-none">
                  {loading ? "" : testimonial.author_name}
                </div>
                {!loading && testimonial.author_role && (
                  <div className="font-body-sm text-body-sm text-on-surface-variant mt-space-xxs">
                    {testimonial.author_role}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row lg:flex-col gap-space-md">
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
