import { Link } from "react-router-dom";

import { getMissions } from "../../api/endpoints";
import Icon from "../../components/Icon";
import SafeImage from "../../components/SafeImage";
import { useFetch } from "../../hooks/useFetch";

/**
 * Spotlights the most recently published Mission (the API already orders
 * missions newest-first). The model has no "featured" flag or funding-
 * progress fields, so this is a straightforward reflection of real data --
 * not the rich funding-bar/location-badge mockup from the reference design,
 * which invented figures no backend field ever backed.
 */

function FeaturedMissionSkeleton() {
  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-12 animate-pulse">
      <div className="lg:col-span-7 min-h-[280px] sm:min-h-[380px] lg:min-h-[520px] bg-surface-container-high" />
      <div className="lg:col-span-5 p-space-xl md:p-space-2xl flex flex-col justify-between gap-space-lg">
        <div className="flex flex-col gap-space-sm">
          <div className="h-3 w-1/3 bg-surface-container-high rounded" />
          <div className="h-7 w-5/6 bg-surface-container-high rounded" />
          <div className="h-4 w-full bg-surface-container-high rounded" />
          <div className="h-4 w-2/3 bg-surface-container-high rounded" />
        </div>
        <div className="h-11 w-full bg-surface-container-high rounded-lg" />
      </div>
    </div>
  );
}

export default function FeaturedMission() {
  const { data, error, loading } = useFetch(() => getMissions());
  const featured = (data || [])[0] || null;
  const showEmptyState = !loading && (error || !featured);

  return (
    <section className="w-full py-space-3xl bg-surface-container-low">
      <div className="w-full max-w-[1320px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
        {loading ? (
          <FeaturedMissionSkeleton />
        ) : (
          <div className="bg-surface-container-lowest rounded-2xl shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7 relative min-h-[280px] sm:min-h-[380px] lg:min-h-[520px]">
              <SafeImage
                src={showEmptyState ? null : featured.image}
                alt={showEmptyState ? "" : featured.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-space-md left-space-md bg-surface-container-lowest/90 backdrop-blur-md px-space-md py-space-xs rounded-full shadow-sm flex items-center gap-space-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container" />
                <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                  {showEmptyState ? "Coming Soon" : "Featured Mission"}
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 p-space-xl md:p-space-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider mb-space-xs">
                  <Icon name="pin_drop" className="text-[16px] text-primary" />
                  <span>From the Field</span>
                </div>

                {showEmptyState ? (
                  <>
                    <h3 className="font-headline-lg text-headline-lg text-on-surface mb-space-md">
                      New Missions Coming Soon
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-space-lg">
                      We're preparing our next field dispatch. Visit the missions page to see
                      everything currently underway.
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="font-headline-lg text-headline-lg text-on-surface mb-space-md">
                      {featured.title}
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-space-lg">
                      {featured.summary}
                    </p>
                  </>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-space-sm pt-space-md">
                <Link
                  to="/get-involved#giving"
                  className="flex-1 inline-flex items-center justify-center px-space-lg py-space-sm bg-primary-container text-on-primary font-label-lg text-label-lg rounded-lg shadow-sm hover:opacity-95 transition-all text-center"
                >
                  Support This Mission
                </Link>
                <Link
                  to="/missions"
                  className="inline-flex items-center justify-center px-space-md py-space-sm bg-surface-container text-on-surface font-label-lg text-label-lg rounded-lg hover:bg-surface-container-high transition-colors"
                >
                  View All Missions
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
