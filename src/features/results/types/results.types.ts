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
