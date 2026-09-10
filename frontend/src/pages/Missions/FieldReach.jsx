/**
 * The reference design showed invented NGO-style stats here ("41,200 Souls
 * Reached", "6 Regional Hubs", a fabricated 82% progress bar). None of that
 * is backed by real data, so this shows counts derived from the actual
 * fetched mission list instead -- real, if modest.
 */
export default function FieldReach({ missionCount, countyCount, loading }) {
  return (
    <div className="lg:col-span-4 flex flex-col gap-space-xs bg-surface-container rounded-xl p-space-md shadow-sm">
      <div className="flex items-center justify-between text-on-surface">
        <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">
          Live Field Reach
        </span>
        <span className="font-headline-sm text-headline-sm text-tertiary font-bold">
          {loading ? "—" : `${missionCount} Mission${missionCount === 1 ? "" : "s"}`}
        </span>
      </div>
      <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant pt-space-xxs">
        <span>Active across Kenya</span>
        <span className="text-primary font-semibold">
          {loading ? "—" : `${countyCount} Count${countyCount === 1 ? "y" : "ies"}`}
        </span>
      </div>
    </div>
  );
}
