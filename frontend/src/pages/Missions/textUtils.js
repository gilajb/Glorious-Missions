/**
 * Truncates at the nearest word boundary at or before `maxLength`, rather
 * than slicing mid-word. Returns the original text unchanged (and
 * `isTruncated: false`) when it already fits.
 */
export function truncateAtWordBoundary(text, maxLength) {
  if (!text || text.length <= maxLength) {
    return { text: text || "", isTruncated: false };
  }

  const slice = text.slice(0, maxLength);
  const lastSpace = slice.lastIndexOf(" ");
  const safeSlice = lastSpace > 0 ? slice.slice(0, lastSpace) : slice;

  return { text: `${safeSlice.trimEnd()}…`, isTruncated: true };
}

/** Extracts the calendar year from an ISO "YYYY-MM-DD" date string. */
export function yearOf(isoDateString) {
  if (!isoDateString) return null;
  const year = new Date(isoDateString).getUTCFullYear();
  return Number.isNaN(year) ? null : year;
}
