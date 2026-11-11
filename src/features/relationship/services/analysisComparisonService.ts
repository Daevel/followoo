import { normalizeUsername } from "@/lib";
import type {
  InstagramAnalysisResult,
  InstagramUser,
} from "@/types/instagram.types";

export type SnapshotForComparison = {
  createdAt: string;
  analysis: InstagramAnalysisResult;
};

export type ComparisonDiff = {
  count: number;
  users: InstagramUser[];
};

export type SnapshotPeriodSummary = {
  createdAt: string;
  /**
   * Latest relationship timestamp in the export (Unix seconds), i.e. how
   * recent the data itself is. `null` when the export carries no
   * timestamps.
   */
  dataUntil: number | null;
  followersCount: number;
  followingCount: number;
  mutualsCount: number;
};

export type AnalysisComparison = {
  older: SnapshotPeriodSummary;
  newer: SnapshotPeriodSummary;
  newFollowers: ComparisonDiff;
  lostFollowers: ComparisonDiff;
  newMutuals: ComparisonDiff;
  lostMutuals: ComparisonDiff;
  newFollowing: ComparisonDiff;
  lostFollowing: ComparisonDiff;
  /**
   * True when `older.dataUntil` is actually more recent (by day) than
   * `newer.dataUntil` - i.e. the export saved first contains data that
   * outdates the one saved second. Purely informational: the UI should
   * surface it as a non-blocking warning, never change which side is
   * "older"/"newer" because of it. See `compareAnalysisSnapshots`'s
   * own comment for why a single anomalous timestamp makes `dataUntil`
   * unsafe as an ordering criterion.
   */
  dataOrderMismatch: boolean;
};

export type ComparisonChartDatum = {
  category: string;
  older: number;
  newer: number;
};

// normalizeUsername (trim+lowercase, @/lib) before comparing - see
// project-context's "Relationship Semantics" - never compare raw
// usernames, even though display keeps the original casing.
function dedupeByUsername(users: InstagramUser[]): InstagramUser[] {
  const map = new Map<string, InstagramUser>();

  for (const user of users) {
    const key = normalizeUsername(user.username);

    if (!map.has(key)) {
      map.set(key, user);
    }
  }

  return Array.from(map.values());
}

/**
 * Reconstructs the three sets a comparison needs from one analysis.
 *
 * `unfollowers` is a legacy field name, not "people who unfollowed you" -
 * see instagramAnalysisService.ts's own comment on it. It means
 * "following-only" (you follow them, they don't follow you back), which
 * is exactly the complement needed to rebuild `following` here. Using it
 * for anything resembling an actual unfollow event would be wrong.
 */
function buildRelationshipSets(analysis: InstagramAnalysisResult) {
  return {
    followers: dedupeByUsername([
      ...analysis.mutual,
      ...analysis.followersOnly,
    ]),
    following: dedupeByUsername([...analysis.mutual, ...analysis.unfollowers]),
    mutuals: dedupeByUsername(analysis.mutual),
  };
}

/** `a` minus `b`, by normalized username - users present in `a` but not `b`. */
function diffUsers(a: InstagramUser[], b: InstagramUser[]): ComparisonDiff {
  const bUsernames = new Set(b.map((user) => normalizeUsername(user.username)));
  const users = a.filter(
    (user) => !bUsernames.has(normalizeUsername(user.username))
  );

  return { count: users.length, users };
}

/**
 * How recent an export's data is: the latest follow/unfollow/request
 * timestamp it contains, in Unix seconds, or `null` if it has none.
 *
 * Informational only - shown to the user as "data up to X", and used to
 * flag a mismatch when it disagrees with save order (`dataOrderMismatch`
 * on `AnalysisComparison`). Not used to decide which snapshot is
 * "older"/"newer": a single per-relationship timestamp from one export
 * (e.g. someone about to be unfollowed, timestamped after everything in
 * the other export) is enough to flip this value for the whole export,
 * which is not a reliable enough signal to order a comparison by - see
 * `compareAnalysisSnapshots`'s own comment.
 */
export function getAnalysisDataUntil(
  analysis: InstagramAnalysisResult
): number | null {
  let latest: number | null = null;

  for (const value of Object.values(analysis)) {
    if (!Array.isArray(value)) continue;

    for (const user of value as InstagramUser[]) {
      if (typeof user.timestamp === "number" && user.timestamp > 0) {
        latest =
          latest === null ? user.timestamp : Math.max(latest, user.timestamp);
      }
    }
  }

  return latest;
}

/**
 * Diffs two history snapshots. "Older" and "newer" follow `createdAt` -
 * the date the app itself saved the snapshot - and only that. It used to
 * follow the date of the data instead (`getAnalysisDataUntil`), on the
 * reasoning that an export covering up to August can be saved after one
 * covering up to October. That broke on real exports: a single
 * per-relationship timestamp (one `following` entry about to be
 * unfollowed, timestamped days after everything else in the *other*
 * export) is enough to flip `getAnalysisDataUntil`'s verdict for the
 * whole export, which silently swapped every category - newly gained
 * followers showing up as "lost", newly mutual accounts showing up as
 * "lost mutuals". `createdAt` can't be wrong that way: the app writes it
 * at save time, it never depends on what's inside the export.
 *
 * `dataUntil` stays on the result as description only (see
 * `SnapshotPeriodSummary`) - never consulted here to decide order. When
 * it still disagrees with the `createdAt` order (the side saved second
 * has older data than the side saved first), `dataOrderMismatch` is set
 * so the UI can flag it non-blockingly instead of silently trusting
 * either signal. The result never depends on argument order.
 */
export function compareAnalysisSnapshots(
  a: SnapshotForComparison,
  b: SnapshotForComparison
): AnalysisComparison {
  const withDates = [a, b].map((snapshot) => ({
    ...snapshot,
    dataUntil: getAnalysisDataUntil(snapshot.analysis),
  }));
  const [older, newer] = withDates.sort(
    (x, y) => new Date(x.createdAt).getTime() - new Date(y.createdAt).getTime()
  );

  const dataOrderMismatch =
    older.dataUntil !== null &&
    newer.dataUntil !== null &&
    Math.floor(older.dataUntil / 86_400) > Math.floor(newer.dataUntil / 86_400);

  const olderSets = buildRelationshipSets(older.analysis);
  const newerSets = buildRelationshipSets(newer.analysis);

  return {
    older: {
      createdAt: older.createdAt,
      dataUntil: older.dataUntil,
      followersCount: olderSets.followers.length,
      followingCount: olderSets.following.length,
      mutualsCount: olderSets.mutuals.length,
    },
    newer: {
      createdAt: newer.createdAt,
      dataUntil: newer.dataUntil,
      followersCount: newerSets.followers.length,
      followingCount: newerSets.following.length,
      mutualsCount: newerSets.mutuals.length,
    },
    newFollowers: diffUsers(newerSets.followers, olderSets.followers),
    lostFollowers: diffUsers(olderSets.followers, newerSets.followers),
    newMutuals: diffUsers(newerSets.mutuals, olderSets.mutuals),
    lostMutuals: diffUsers(olderSets.mutuals, newerSets.mutuals),
    newFollowing: diffUsers(newerSets.following, olderSets.following),
    lostFollowing: diffUsers(olderSets.following, newerSets.following),
    dataOrderMismatch,
  };
}

/** Pure data prep for the grouped bar chart - kept separate from rendering. */
export function buildComparisonChartData(
  comparison: AnalysisComparison
): ComparisonChartDatum[] {
  return [
    {
      category: "Followers",
      older: comparison.older.followersCount,
      newer: comparison.newer.followersCount,
    },
    {
      category: "Following",
      older: comparison.older.followingCount,
      newer: comparison.newer.followingCount,
    },
    {
      category: "Mutuals",
      older: comparison.older.mutualsCount,
      newer: comparison.newer.mutualsCount,
    },
  ];
}
