import { getMissions } from "../api/endpoints";
import CountyFilterPills from "../components/CountyFilterPills";
import Icon from "../components/Icon";
import { useCountyFilter } from "../hooks/useCountyFilter";
import { useFetch } from "../hooks/useFetch";
import ClosingCta from "./Missions/ClosingCta";
import FieldReach from "./Missions/FieldReach";
import MissionCard, { MissionCardSkeleton } from "./Missions/MissionCard";

export default function Missions() {
  const { data, error, loading } = useFetch(() => getMissions());
  const { items: missions, counties, countyCounts, selectedCounty, setSelectedCounty, filteredItems: filteredMissions } =
    useCountyFilter(data);

  const showEmptyState = !loading && (error || missions.length === 0);

  return (
    <div className="flex flex-col w-full">
      <section className="relative w-full bg-surface-container-low overflow-hidden py-space-3xl">
        <div className="relative w-full px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-[1320px] mx-auto flex flex-col gap-space-lg">
          <div className="flex items-center gap-space-xs flex-wrap">
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold">
              Missions Across Kenya
            </span>
            <span className="text-outline-variant">&bull;</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant tracking-wider">
              Church Planting &amp; Discipleship
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-end">
            <div className="lg:col-span-8 flex flex-col gap-space-sm">
              <h1 className="font-display text-display-mobile md:text-display text-on-surface tracking-tight leading-tight">
                Active Missions Across Kenya
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
                From the streets of Nairobi to the highland plains of Marsabit and the pastoral
                communities of Samburu, we plant churches, disciple believers, and document God's
                work across Kenya's counties.
              </p>
            </div>

            <FieldReach
              missionCount={missions.length}
              countyCount={counties.length}
              loading={loading}
            />
          </div>

          {!showEmptyState && (
            <div className="pt-space-md">
              <CountyFilterPills
                counties={counties}
                countyCounts={countyCounts}
                totalCount={missions.length}
                selectedCounty={selectedCounty}
                onSelect={setSelectedCounty}
                allLabel="All Missions"
              />
            </div>
          )}
        </div>
      </section>

      <section className="w-full py-space-2xl bg-surface">
        <div className="w-full px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-[1320px] mx-auto">
          {showEmptyState ? (
            <div className="flex flex-col items-center text-center gap-space-xs py-space-2xl bg-surface-container-low rounded-xl">
              <Icon name="explore_off" className="text-[32px] text-outline" />
              <p className="font-body-md text-body-md text-on-surface-variant">
                No missions to show right now — check back soon.
              </p>
            </div>
          ) : filteredMissions.length === 0 && !loading ? (
            <div className="flex flex-col items-center text-center gap-space-xs py-space-2xl bg-surface-container-low rounded-xl">
              <Icon name="filter_alt_off" className="text-[32px] text-outline" />
              <p className="font-body-md text-body-md text-on-surface-variant">
                No published missions in {selectedCounty} right now.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg items-stretch">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <MissionCardSkeleton key={i} />)
                : filteredMissions.map((mission) => (
                    <MissionCard key={mission.id} mission={mission} />
                  ))}
            </div>
          )}
        </div>
      </section>

      <ClosingCta />
    </div>
  );
}
