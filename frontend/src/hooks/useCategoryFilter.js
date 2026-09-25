import { useMemo, useState } from "react";

export const ALL_CATEGORY = "all";

// Fixed taxonomy (matches GalleryImage.Category on the backend), not derived
// from the fetched data -- all five categories always show as filter options
// so the sort is visible even before every bucket has a published photo.
export const CATEGORIES = [
  { value: "missions", label: "Missions" },
  { value: "people", label: "People" },
  { value: "places", label: "Places" },
  { value: "stories", label: "Stories" },
  { value: "documentaries", label: "Documentaries" },
];

const EMPTY = [];

/**
 * Filters a fetched gallery list by its `category` field.
 *
 * @param {object[]|null} data - the raw fetch result (nullable while loading)
 */
export function useCategoryFilter(data) {
  const items = data ?? EMPTY;
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY);

  const categoryCounts = useMemo(() => {
    const counts = new Map();
    for (const item of items) {
      if (!item.category) continue;
      counts.set(item.category, (counts.get(item.category) || 0) + 1);
    }
    return counts;
  }, [items]);

  const filteredItems =
    selectedCategory === ALL_CATEGORY
      ? items
      : items.filter((item) => item.category === selectedCategory);

  return { items, categoryCounts, selectedCategory, setSelectedCategory, filteredItems };
}
