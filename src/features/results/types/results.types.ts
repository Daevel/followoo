import type { InstagramAnalysisResult } from "@/types/instagram.types";

export type SortKey =
  | "alphabeticalAsc"
  | "alphabeticalDesc"
  | "recentDesc"
  | "recentAsc";

export type TabKey =
  | "mutual"
  | "followersOnly"
  | "unfollowers"
  | "recentUnfollowers"
  | "blocked"
  | "restricted"
  | "closeFriends"
  | "hideStoriesFrom"
  | "pendingFollowRequests"
  | "recentFollowRequests";

export type ResultsEmptyState = {
  title: string;
  description: string;
};

export type ResultsTabInfo = {
  sectionTitle: string;
  description: string;
};

/** Navigation state of `/results`, set by the upload flow. */
export type ResultsLocationState = {
  analysis: InstagramAnalysisResult;
  /** History is activated but was locked, so this analysis wasn't saved. */
  isHistorySavePending: boolean;
};
