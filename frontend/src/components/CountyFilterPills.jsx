import { ALL_COUNTY } from "../hooks/useCountyFilter";
import Icon from "./Icon";

function pillClassName(isActive) {
  return [
    "px-space-md py-space-xs rounded-full font-label-md text-label-md transition-all duration-200 cursor-pointer flex items-center gap-space-xs",
    isActive
      ? "bg-primary-container text-on-primary shadow-sm"
      : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
  ].join(" ");
}

/**
 * "All" plus one pill per county, counts included. Pair with
 * useCountyFilter, which supplies `counties`/`countyCounts`/`selectedCounty`.
 */
export default function CountyFilterPills({
  counties,
  countyCounts,
  totalCount,
  selectedCounty,
  onSelect,
  allLabel = "All",
}) {
  return (
    <div className="flex flex-wrap items-center gap-space-xs">
      <button
        type="button"
        onClick={() => onSelect(ALL_COUNTY)}
        className={pillClassName(selectedCounty === ALL_COUNTY)}
      >
        <Icon name="apps" className="text-[18px]" />
        <span>{allLabel}</span>
        <span className="ml-1 px-1.5 py-0.5 rounded-full bg-on-primary/20 text-[10px] font-bold">
          {totalCount}
        </span>
      </button>
      {counties.map((county) => (
        <button
          key={county}
          type="button"
          onClick={() => onSelect(county)}
          className={pillClassName(selectedCounty === county)}
        >
          <Icon name="place" className="text-[18px]" />
          <span>{county}</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-full bg-on-primary/20 text-[10px] font-bold">
            {countyCounts.get(county)}
          </span>
        </button>
      ))}
    </div>
  );
}
