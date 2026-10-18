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
 * Diffs two history snapshots. Internally sorts by `createdAt` so the
 * result is the same regardless of which order the caller passes them in
 * - "new"/"lost" always means relative to chronological order, never to
 * argument order.
 */
export function compareAnalysisSnapshots(
  a: SnapshotForComparison,
  b: SnapshotForComparison
): AnalysisComparison {
  const [older, newer] = [a, b].sort(
    (x, y) => new Date(x.createdAt).getTime() - new Date(y.createdAt).getTime()
  );

  const olderSets = buildRelationshipSets(older.analysis);
  const newerSets = buildRelationshipSets(newer.analysis);

  return {
    older: {
      createdAt: older.createdAt,
      followersCount: olderSets.followers.length,
      followingCount: olderSets.following.length,
      mutualsCount: olderSets.mutuals.length,
    },
    newer: {
      createdAt: newer.createdAt,
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
