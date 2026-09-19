import { useMemo, useState } from "react";

export const ALL_COUNTY = "all";

const EMPTY = [];

/**
 * Derives a county filter over a fetched list, rather than hardcoding a
 * fixed set of options -- a new county just needs one published row tagged
 * with it, no code change. Used by Missions (Gallery has no county field).
 *
 * @param {object[]|null} data - the raw fetch result (nullable while loading)
 * @param {object} [options]
 * @param {string} [options.countyKey] - property name holding the county value
 */
export function useCountyFilter(data, { countyKey = "county" } = {}) {
  const items = data ?? EMPTY;
  const [selectedCounty, setSelectedCounty] = useState(ALL_COUNTY);

  const countyCounts = useMemo(() => {
    const counts = new Map();
    for (const item of items) {
      const county = item[countyKey];
      if (!county) continue;
      counts.set(county, (counts.get(county) || 0) + 1);
    }
    return counts;
  }, [items, countyKey]);

  const counties = useMemo(() => Array.from(countyCounts.keys()).sort(), [countyCounts]);

  const filteredItems =
    selectedCounty === ALL_COUNTY ? items : items.filter((item) => item[countyKey] === selectedCounty);

  return { items, counties, countyCounts, selectedCounty, setSelectedCounty, filteredItems };
}
