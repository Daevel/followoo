import type { InstagramAnalysisResult } from "../../types/instagram.types";

export type RelationshipHealthLevel = "healthy" | "average" | "critical";

export type RelationshipHealthColor = "primary" | "foreground" | "accent";

export type RelationshipHealthResult = {
  score: number;
  level: RelationshipHealthLevel;
  color: RelationshipHealthColor;
  title: string;
  description: string;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function calculateRelationshipHealthScore(
  analysis: InstagramAnalysisResult,
): RelationshipHealthResult {
  const mutualCount = analysis.mutual.length;
  const followersOnlyCount = analysis.followersOnly.length;
  const unfollowersCount = analysis.unfollowers.length;
  const recentUnfollowersCount = analysis.recentUnfollowers.length;

  const relationshipBase = mutualCount + followersOnlyCount + unfollowersCount;

  if (relationshipBase === 0) {
    return {
      score: 50,
      level: "average",
      color: "foreground",
      title: "Not enough data",
      description:
        "We need more relationship data to evaluate your network health.",
    };
  }

  const mutualRatio = mutualCount / relationshipBase;
  const unfollowersRatio = unfollowersCount / relationshipBase;
  const recentUnfollowersRatio = recentUnfollowersCount / relationshipBase;

  const baseScore = mutualRatio * 100;
  const unfollowPenalty = unfollowersRatio * 30;
  const recentPenalty = recentUnfollowersRatio * 40;

  const rawScore = baseScore - unfollowPenalty - recentPenalty;
  const score = Math.round(clamp(rawScore, 0, 100));

  if (score >= 70) {
    return {
      score,
      level: "healthy",
      color: "primary",
      title: "Healthy network",
      description:
        "Most of your analyzed relationships look balanced and stable.",
    };
  }

  if (score >= 40) {
    return {
      score,
      level: "average",
      color: "foreground",
      title: "Could be improved",
      description:
        "Your network looks fairly balanced, but there are still some weak spots.",
    };
  }

  return {
    score,
    level: "critical",
    color: "accent",
    title: "Needs attention",
    description:
      "A large part of your analyzed relationships looks unbalanced or unstable.",
  };
}
