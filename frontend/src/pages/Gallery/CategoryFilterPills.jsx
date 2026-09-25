import { ALL_CATEGORY, CATEGORIES } from "../../hooks/useCategoryFilter";
import Icon from "../../components/Icon";

function pillClassName(isActive) {
  return [
    "px-space-md py-space-xs rounded-full font-label-md text-label-md transition-all duration-200 cursor-pointer flex items-center gap-space-xs",
    isActive
      ? "bg-primary-container text-on-primary shadow-sm"
      : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
  ].join(" ");
}

/**
 * "All" plus one pill per fixed gallery category (Missions/People/Places/
 * Stories/Documentaries), counts included. Pair with useCategoryFilter.
 */
export default function CategoryFilterPills({
  categoryCounts,
  totalCount,
  selectedCategory,
  onSelect,
}) {
  return (
    <div className="flex flex-wrap items-center gap-space-xs">
      <button
        type="button"
        onClick={() => onSelect(ALL_CATEGORY)}
        className={pillClassName(selectedCategory === ALL_CATEGORY)}
      >
        <Icon name="apps" className="text-[18px]" />
        <span>All</span>
        <span className="ml-1 px-1.5 py-0.5 rounded-full bg-on-primary/20 text-[10px] font-bold">
          {totalCount}
        </span>
      </button>
      {CATEGORIES.map((category) => (
        <button
          key={category.value}
          type="button"
          onClick={() => onSelect(category.value)}
          className={pillClassName(selectedCategory === category.value)}
        >
          <Icon name="sell" className="text-[18px]" />
          <span>{category.label}</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-full bg-on-primary/20 text-[10px] font-bold">
            {categoryCounts.get(category.value) || 0}
          </span>
        </button>
      ))}
    </div>
  );
}
