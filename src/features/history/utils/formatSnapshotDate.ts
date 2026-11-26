// History dates are in English like the rest of the app (formatDate in
// @/lib uses en-US too), whatever the browser's language.

/** Save date and time of a history entry, e.g. "Nov 24, 2026, 6:42 PM". */
export function formatSnapshotDate(isoDate: string): string {
  return new Date(isoDate).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/** Save day of a history entry, e.g. "Nov 24, 2026". */
export function formatSnapshotDay(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
