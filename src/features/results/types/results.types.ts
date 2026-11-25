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
  /** Who is in the list and why, from the user's side. */
  description: string;
  /** What the user can do about it. */
  action: string;
  /** What the date on each row means, e.g. "Follows you since". */
  dateLabel: string;
};

/** Navigation state of `/results`, set by the upload flow. */
export type ResultsLocationState = {
  analysis: InstagramAnalysisResult;
  /** History is activated but was locked, so this analysis wasn't saved. */
  isHistorySavePending: boolean;
};
