/** Formats an ISO datetime string as e.g. "March 2024". Returns null on bad input. */
export function formatMonthYear(isoString) {
  if (!isoString) return null;
  try {
    return new Date(isoString).toLocaleDateString(undefined, { month: "long", year: "numeric" });
  } catch {
    return null;
  }
}
