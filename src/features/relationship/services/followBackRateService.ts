import type { InstagramAnalysisResult } from "@/types/instagram.types";

export type FollowBackLevel =
  | "balanced"
  | "roomToImprove"
  | "oneWay"
  | "noData";

export type FollowBackRateResult = {
  /** Share of the people you follow who follow you back, 0-100. */
  rate: number;
  level: FollowBackLevel;
  /** Short level name shown in the badge. */
  label: string;
  mutualCount: number;
  followingCount: number;
  /** One plain sentence with the numbers behind the rate. */
  summary: string;
  /** What the level means and where to look first. */
  hint: string;
};

/** Levels start at these rates; written here so the UI can state them. */
export const FOLLOW_BACK_THRESHOLDS = { balanced: 70, roomToImprove: 40 };

/**
 * Follow-back rate: how many of the people you follow follow you back
 * (Mutual ÷ everyone you follow). One declared formula, so the user can see
 * what moves it. Nothing from "recently unfollowed" enters it: that list
 * holds accounts the user unfollowed, not people who left them.
 */
export function calculateFollowBackRate(
  analysis: InstagramAnalysisResult
): FollowBackRateResult {
  const mutualCount = analysis.mutual.length;
  const followingCount = mutualCount + analysis.unfollowers.length;

  if (followingCount === 0) {
    return {
      rate: 0,
      level: "noData",
      label: "No data yet",
      mutualCount,
      followingCount,
      summary: "You don't follow anyone in this export.",
      hint: "Follow-back rate needs at least one account you follow.",
    };
  }

  const rate = Math.round((mutualCount / followingCount) * 100);
  const summary = `${mutualCount} of the ${followingCount} people you follow follow you back.`;

  if (rate >= FOLLOW_BACK_THRESHOLDS.balanced) {
    return {
      rate,
      level: "balanced",
      label: "Balanced",
      mutualCount,
      followingCount,
      summary,
      hint: "Most of the people you follow follow you back.",
    };
  }

  if (rate >= FOLLOW_BACK_THRESHOLDS.roomToImprove) {
    return {
      rate,
      level: "roomToImprove",
      label: "Room to improve",
      mutualCount,
      followingCount,
      summary,
      hint: "Review who doesn't follow you back and keep only the accounts you care about.",
    };
  }

  return {
    rate,
    level: "oneWay",
    label: "Mostly one-way",
    mutualCount,
    followingCount,
    summary,
    hint: "Most people you follow don't follow you back. Start from that list.",
  };
}
