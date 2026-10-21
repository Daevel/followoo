import { describe, expect, it } from "vitest";
import type {
  InstagramAnalysisResult,
  InstagramUser,
} from "@/types/instagram.types";
import {
  buildComparisonChartData,
  compareAnalysisSnapshots,
  getAnalysisDataUntil,
} from "./analysisComparisonService";

function mkUser(username: string): InstagramUser {
  return { username };
}

function mkUserAt(username: string, isoDate: string): InstagramUser {
  return { username, timestamp: Date.parse(isoDate) / 1000 };
}

function usernamesOf(users: InstagramUser[]): string[] {
  return users.map((user) => user.username).sort();
}

function buildAnalysis(
  overrides: Partial<InstagramAnalysisResult>
): InstagramAnalysisResult {
  return {
    mutual: [],
    followersOnly: [],
    unfollowers: [],
    recentUnfollowers: [],
    blocked: [],
    restricted: [],
    closeFriends: [],
    hideStoriesFrom: [],
    pendingFollowRequests: [],
    recentFollowRequests: [],
    sourceCounts: { followers: 0, following: 0 },
    ...overrides,
  };
}

describe("compareAnalysisSnapshots", () => {
  it("orders by createdAt (save date), not by the date of the data, even when they disagree", () => {
    // Saved first (createdAt earlier), but its data runs until October.
    const savedFirst = {
      createdAt: "2026-10-18T09:00:00Z",
      analysis: buildAnalysis({
        mutual: [mkUserAt("alice", "2025-01-10T00:00:00Z")],
        followersOnly: [
          mkUserAt("bob", "2025-03-01T00:00:00Z"),
          mkUserAt("dave", "2026-10-02T00:00:00Z"),
        ],
      }),
    };
    // Saved afterwards (createdAt later), but its data stops at August 31.
    const savedSecond = {
      createdAt: "2026-10-18T10:00:00Z",
      analysis: buildAnalysis({
        mutual: [mkUserAt("alice", "2025-01-10T00:00:00Z")],
        followersOnly: [
          mkUserAt("bob", "2025-03-01T00:00:00Z"),
          mkUserAt("carol", "2026-08-31T00:00:00Z"),
        ],
      }),
    };

    for (const comparison of [
      compareAnalysisSnapshots(savedFirst, savedSecond),
      compareAnalysisSnapshots(savedSecond, savedFirst),
    ]) {
      // older = savedFirst (earlier createdAt), even though its data is
      // the more recent of the two - createdAt alone decides this.
      // followers(older) = alice, bob, dave / followers(newer) = alice, bob, carol
      expect(comparison.older.createdAt).toBe("2026-10-18T09:00:00Z");
      expect(comparison.newer.createdAt).toBe("2026-10-18T10:00:00Z");
      expect(usernamesOf(comparison.newFollowers.users)).toEqual(["carol"]);
      expect(usernamesOf(comparison.lostFollowers.users)).toEqual(["dave"]);
      // The two sides' data dates disagree with their save-date order -
      // flagged, not silently trusted or used to flip anything.
      expect(comparison.dataOrderMismatch).toBe(true);
    }
  });

  it("reports no mismatch when data date and save date agree", () => {
    const older = {
      createdAt: "2026-09-01T00:00:00Z",
      analysis: buildAnalysis({
        followersOnly: [mkUserAt("bob", "2026-08-01T00:00:00Z")],
      }),
    };
    const newer = {
      createdAt: "2026-10-01T00:00:00Z",
      analysis: buildAnalysis({
        followersOnly: [mkUserAt("bob", "2026-09-15T00:00:00Z")],
      }),
    };

    const comparison = compareAnalysisSnapshots(older, newer);

    expect(comparison.dataOrderMismatch).toBe(false);
  });

  it("does not flag a mismatch when either side has no timestamps to compare", () => {
    const withDates = {
      createdAt: "2026-09-01T00:00:00Z",
      analysis: buildAnalysis({
        followersOnly: [mkUserAt("bob", "2026-08-01T00:00:00Z")],
      }),
    };
    const withoutDates = {
      createdAt: "2026-10-01T00:00:00Z",
      analysis: buildAnalysis({ followersOnly: [mkUser("carol")] }),
    };

    expect(
      compareAnalysisSnapshots(withDates, withoutDates).dataOrderMismatch
    ).toBe(false);
  });

  it("regression: a single anomalous following timestamp must not invert the comparison", () => {
    // Reproduces the real bug shape (anonymized): the export saved first
    // (true "older") has one following-only entry timestamped *after*
    // the latest timestamp anywhere in the export saved second (true
    // "newer"). Under the old data-date ordering this flipped every
    // category; createdAt must keep the real save order regardless.
    const olderExport = {
      createdAt: "2026-09-01T00:00:00Z",
      analysis: buildAnalysis({
        mutual: [mkUserAt("alice", "2026-08-01T00:00:00Z")],
        followersOnly: [mkUserAt("bob", "2026-08-02T00:00:00Z")],
        // following-only entry about to be unfollowed, timestamped days
        // after the newer export's latest timestamp below.
        unfollowers: [mkUserAt("zara", "2026-10-20T00:00:00Z")],
      }),
    };
    const newerExport = {
      createdAt: "2026-10-01T00:00:00Z",
      analysis: buildAnalysis({
        mutual: [
          mkUserAt("alice", "2026-08-01T00:00:00Z"),
          mkUserAt("bob", "2026-09-20T00:00:00Z"),
        ],
        followersOnly: [mkUserAt("carol", "2026-09-21T00:00:00Z")],
      }),
    };

    const comparison = compareAnalysisSnapshots(olderExport, newerExport);

    expect(comparison.older.createdAt).toBe("2026-09-01T00:00:00Z");
    expect(comparison.newer.createdAt).toBe("2026-10-01T00:00:00Z");
    // bob moved from followers-only to mutual, carol is a brand new
    // follower - both must land as "new", not "lost".
    expect(usernamesOf(comparison.newFollowers.users)).toEqual(["carol"]);
    expect(usernamesOf(comparison.lostFollowers.users)).toEqual([]);
    expect(usernamesOf(comparison.newMutuals.users)).toEqual(["bob"]);
    expect(usernamesOf(comparison.lostMutuals.users)).toEqual([]);
    // The anomalous timestamp still gets flagged, just never trusted.
    expect(comparison.dataOrderMismatch).toBe(true);
  });

  it("exposes how recent each side's data is", () => {
    const comparison = compareAnalysisSnapshots(
      {
        createdAt: "2026-09-01T00:00:00Z",
        analysis: buildAnalysis({
          mutual: [mkUserAt("alice", "2026-08-31T00:00:00Z")],
        }),
      },
      {
        createdAt: "2026-10-01T00:00:00Z",
        analysis: buildAnalysis({ mutual: [mkUser("alice")] }),
      }
    );

    expect(comparison.older.dataUntil).toBe(
      Date.parse("2026-08-31T00:00:00Z") / 1000
    );
    expect(comparison.newer.dataUntil).toBeNull();
  });

  it("orders by createdAt and diffs correctly even when one side has no timestamps at all", () => {
    const withDates = {
      createdAt: "2026-10-01T00:00:00Z",
      analysis: buildAnalysis({
        followersOnly: [mkUserAt("bob", "2026-12-01T00:00:00Z")],
      }),
    };
    const withoutDates = {
      createdAt: "2026-09-01T00:00:00Z",
      analysis: buildAnalysis({ followersOnly: [mkUser("carol")] }),
    };

    const comparison = compareAnalysisSnapshots(withDates, withoutDates);

    expect(comparison.older.createdAt).toBe("2026-09-01T00:00:00Z");
    expect(usernamesOf(comparison.newFollowers.users)).toEqual(["bob"]);
  });

  it("sorts by createdAt internally - the result is the same regardless of argument order", () => {
    const earlier = {
      createdAt: "2026-09-01T00:00:00Z",
      analysis: buildAnalysis({
        mutual: ["alice"].map(mkUser),
        followersOnly: ["bob"].map(mkUser),
      }),
    };
    const later = {
      createdAt: "2026-10-01T00:00:00Z",
      analysis: buildAnalysis({
        mutual: ["alice"].map(mkUser),
        followersOnly: ["carol"].map(mkUser),
      }),
    };

    const forward = compareAnalysisSnapshots(earlier, later);
    const backward = compareAnalysisSnapshots(later, earlier);

    expect(forward).toEqual(backward);
    expect(forward.older.createdAt).toBe("2026-09-01T00:00:00Z");
    expect(forward.newer.createdAt).toBe("2026-10-01T00:00:00Z");
    expect(usernamesOf(forward.newFollowers.users)).toEqual(["carol"]);
    expect(usernamesOf(forward.lostFollowers.users)).toEqual(["bob"]);
  });

  it("computes new/lost followers from partial overlap", () => {
    const older = {
      createdAt: "2026-09-01T00:00:00Z",
      analysis: buildAnalysis({
        mutual: ["alice"].map(mkUser),
        followersOnly: ["bob", "carol"].map(mkUser),
      }),
    };
    const newer = {
      createdAt: "2026-10-01T00:00:00Z",
      analysis: buildAnalysis({
        mutual: ["alice"].map(mkUser),
        followersOnly: ["carol", "dave"].map(mkUser),
      }),
    };

    const result = compareAnalysisSnapshots(older, newer);

    // followers(older) = alice, bob, carol / followers(newer) = alice, carol, dave
    expect(usernamesOf(result.newFollowers.users)).toEqual(["dave"]);
    expect(result.newFollowers.count).toBe(1);
    expect(usernamesOf(result.lostFollowers.users)).toEqual(["bob"]);
    expect(result.lostFollowers.count).toBe(1);
  });

  it("computes new/lost mutuals independently from followers-only churn", () => {
    const older = {
      createdAt: "2026-09-01T00:00:00Z",
      analysis: buildAnalysis({ mutual: ["alice", "bob"].map(mkUser) }),
    };
    const newer = {
      createdAt: "2026-10-01T00:00:00Z",
      analysis: buildAnalysis({ mutual: ["alice", "carol"].map(mkUser) }),
    };

    const result = compareAnalysisSnapshots(older, newer);

    expect(usernamesOf(result.newMutuals.users)).toEqual(["carol"]);
    expect(usernamesOf(result.lostMutuals.users)).toEqual(["bob"]);
  });

  it("computes new/lost following using the legacy-named unfollowers field as following-only", () => {
    const older = {
      createdAt: "2026-09-01T00:00:00Z",
      analysis: buildAnalysis({
        mutual: ["alice"].map(mkUser),
        unfollowers: ["bob"].map(mkUser), // following-only, not an unfollow event
      }),
    };
    const newer = {
      createdAt: "2026-10-01T00:00:00Z",
      analysis: buildAnalysis({
        mutual: ["alice"].map(mkUser),
        unfollowers: ["carol"].map(mkUser),
      }),
    };

    const result = compareAnalysisSnapshots(older, newer);

    expect(usernamesOf(result.newFollowing.users)).toEqual(["carol"]);
    expect(usernamesOf(result.lostFollowing.users)).toEqual(["bob"]);
  });

  it("has no overlap between new followers and lost followers", () => {
    const older = {
      createdAt: "2026-09-01T00:00:00Z",
      analysis: buildAnalysis({ followersOnly: ["bob"].map(mkUser) }),
    };
    const newer = {
      createdAt: "2026-10-01T00:00:00Z",
      analysis: buildAnalysis({ followersOnly: ["dave"].map(mkUser) }),
    };

    const result = compareAnalysisSnapshots(older, newer);

    const newSet = new Set(usernamesOf(result.newFollowers.users));
    const lostSet = new Set(usernamesOf(result.lostFollowers.users));
    expect([...newSet].some((username) => lostSet.has(username))).toBe(false);
  });

  it("returns empty diffs on every category for identical snapshots", () => {
    const analysis = buildAnalysis({
      mutual: ["alice"].map(mkUser),
      followersOnly: ["bob"].map(mkUser),
      unfollowers: ["carol"].map(mkUser),
    });
    const first = { createdAt: "2026-09-01T00:00:00Z", analysis };
    const second = { createdAt: "2026-10-01T00:00:00Z", analysis };

    const result = compareAnalysisSnapshots(first, second);

    expect(result.newFollowers.count).toBe(0);
    expect(result.lostFollowers.count).toBe(0);
    expect(result.newMutuals.count).toBe(0);
    expect(result.lostMutuals.count).toBe(0);
    expect(result.newFollowing.count).toBe(0);
    expect(result.lostFollowing.count).toBe(0);
  });

  it("returns every user as new when there is no overlap at all", () => {
    const older = {
      createdAt: "2026-09-01T00:00:00Z",
      analysis: buildAnalysis({ followersOnly: ["bob"].map(mkUser) }),
    };
    const newer = {
      createdAt: "2026-10-01T00:00:00Z",
      analysis: buildAnalysis({ followersOnly: ["carol", "dave"].map(mkUser) }),
    };

    const result = compareAnalysisSnapshots(older, newer);

    expect(usernamesOf(result.newFollowers.users)).toEqual(["carol", "dave"]);
    expect(usernamesOf(result.lostFollowers.users)).toEqual(["bob"]);
  });

  it("compares usernames case-insensitively, trimmed, matching project-wide convention", () => {
    const older = {
      createdAt: "2026-09-01T00:00:00Z",
      analysis: buildAnalysis({ followersOnly: [{ username: "  Bob  " }] }),
    };
    const newer = {
      createdAt: "2026-10-01T00:00:00Z",
      analysis: buildAnalysis({ followersOnly: [{ username: "bob" }] }),
    };

    const result = compareAnalysisSnapshots(older, newer);

    expect(result.newFollowers.count).toBe(0);
    expect(result.lostFollowers.count).toBe(0);
  });

  it("deduplicates a user appearing in both mutual and followersOnly within the same snapshot", () => {
    // Defensive: should never happen given analyzeInstagramExport's own
    // invariants, but buildRelationshipSets must not double-count if it did.
    const snapshot = {
      createdAt: "2026-09-01T00:00:00Z",
      analysis: buildAnalysis({
        mutual: ["alice"].map(mkUser),
        followersOnly: ["alice"].map(mkUser),
      }),
    };

    const result = compareAnalysisSnapshots(snapshot, snapshot);

    expect(result.older.followersCount).toBe(1);
  });
});

describe("getAnalysisDataUntil", () => {
  it("returns the latest timestamp across every relationship list", () => {
    const analysis = buildAnalysis({
      mutual: [mkUserAt("alice", "2025-01-10T00:00:00Z")],
      unfollowers: [mkUserAt("bob", "2026-05-01T00:00:00Z")],
      recentUnfollowers: [mkUserAt("carol", "2026-10-17T00:00:00Z")],
    });

    expect(getAnalysisDataUntil(analysis)).toBe(
      Date.parse("2026-10-17T00:00:00Z") / 1000
    );
  });

  it("returns null when no user carries a timestamp", () => {
    expect(
      getAnalysisDataUntil(buildAnalysis({ mutual: [mkUser("alice")] }))
    ).toBeNull();
  });
});

describe("buildComparisonChartData", () => {
  it("maps older/newer totals into one datum per category", () => {
    const older = {
      createdAt: "2026-09-01T00:00:00Z",
      analysis: buildAnalysis({
        mutual: ["alice"].map(mkUser),
        followersOnly: ["bob"].map(mkUser),
        unfollowers: ["carol"].map(mkUser),
      }),
    };
    const newer = {
      createdAt: "2026-10-01T00:00:00Z",
      analysis: buildAnalysis({
        mutual: ["alice", "dave"].map(mkUser),
        followersOnly: [].map(mkUser),
        unfollowers: ["carol", "erin"].map(mkUser),
      }),
    };

    const comparison = compareAnalysisSnapshots(older, newer);
    const chartData = buildComparisonChartData(comparison);

    expect(chartData).toEqual([
      { category: "Followers", older: 2, newer: 2 },
      { category: "Following", older: 2, newer: 4 },
      { category: "Mutuals", older: 1, newer: 2 },
    ]);
  });
});
