import { useState } from "react";
import { Link } from "react-router-dom";

import Icon from "../../components/Icon";
import SafeImage from "../../components/SafeImage";
import { truncateAtWordBoundary, yearOf } from "./textUtils";

const SUMMARY_LIMIT = 160;

function dateRangeLabel(mission) {
  const startYear = yearOf(mission.start_date);
  if (!startYear) return null;
  const endYear = yearOf(mission.end_date);
  return endYear ? `${startYear} – ${endYear}` : `Since ${startYear}`;
}

export default function MissionCard({ mission }) {
  const [expanded, setExpanded] = useState(false);
  const { text: truncatedSummary, isTruncated } = truncateAtWordBoundary(
    mission.summary,
    SUMMARY_LIMIT
  );
  const dateLabel = dateRangeLabel(mission);

  return (
    <article className="flex flex-col h-full bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
      <Link
        to={`/mission-mondays/${mission.id}`}
        className="relative w-full h-64 overflow-hidden bg-surface-container block"
      >
        <SafeImage
          src={mission.image}
          alt={mission.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        {mission.video_url && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
              <Icon name="play_arrow" className="text-[28px] text-white" />
            </span>
          </div>
        )}
        {mission.county && (
          <div className="absolute top-space-sm left-space-sm flex items-center gap-space-xs">
            <span className="inline-flex items-center px-space-sm py-space-xxs rounded-full bg-tertiary-container text-on-tertiary font-label-sm text-label-sm shadow-md">
              <Icon name="place" className="text-[14px] mr-1" />
              {mission.county} County
            </span>
          </div>
        )}
        {dateLabel && (
          <div className="absolute bottom-space-sm left-space-sm">
            <span className="text-on-primary font-label-sm text-label-sm bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
              {dateLabel}
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-col flex-1 p-space-lg gap-space-md justify-between">
        <div className="flex flex-col gap-space-xs">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">
            <Link to={`/mission-mondays/${mission.id}`} className="hover:text-primary transition-colors">
              {mission.title}
            </Link>
          </h2>
          {mission.summary && (
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              {expanded ? mission.summary : truncatedSummary}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-space-sm">
          {isTruncated && (
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className="inline-flex items-center gap-1 font-label-md text-label-md text-primary hover:text-primary-container font-semibold"
            >
              <span>{expanded ? "Show less" : "Read more"}</span>
              <Icon name={expanded ? "expand_less" : "expand_more"} className="text-[16px]" />
            </button>
          )}
          <Link
            to={`/mission-mondays/${mission.id}`}
            className="inline-flex items-center gap-1 font-label-md text-label-md text-on-surface-variant hover:text-primary ml-auto"
          >
            <span>Full story</span>
            <Icon name="arrow_forward" className="text-[16px]" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function MissionCardSkeleton() {
  return (
    <div className="flex flex-col h-full bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm animate-pulse">
      <div className="h-64 w-full bg-surface-container" />
      <div className="flex flex-col gap-space-sm p-space-lg">
        <div className="h-5 w-3/4 bg-surface-container rounded" />
        <div className="h-4 w-full bg-surface-container rounded" />
        <div className="h-4 w-2/3 bg-surface-container rounded" />
      </div>
    </div>
  );
}
