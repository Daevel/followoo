import type {
  ResultsEmptyState,
  ResultsTabInfo,
  TabKey,
} from "../types/results.types";

const emptyStatesByTab: Record<TabKey, ResultsEmptyState> = {
  mutual: {
    title: "No mutual connections yet",
    description:
      "We couldn't find any people who follow you back in this export.",
  },
  followersOnly: {
    title: "No follower-only users found",
    description:
      "There are no people in this export who follow you while you don't follow them back.",
  },
  unfollowers: {
    title: "No following-only users found",
    description: "Good news — everyone you follow appears to follow you back.",
  },
  recentUnfollowers: {
    title: "No recent unfollowers found",
    description:
      "We couldn't find any recent unfollow activity in this export.",
  },
  blocked: {
    title: "No blocked users found",
    description: "There are no blocked users available in this export.",
  },
  restricted: {
    title: "No restricted users found",
    description: "There are no restricted users available in this export.",
  },
  closeFriends: {
    title: "No close friends found",
    description: "There are no close friends available in this export.",
  },
  hideStoriesFrom: {
    title: "No hidden stories users found",
    description: "There are no users hidden from your stories in this export.",
  },
  pendingFollowRequests: {
    title: "No pending follow requests found",
    description:
      "There are no pending follow requests available in this export.",
  },
  recentFollowRequests: {
    title: "No recent follow requests found",
    description:
      "There are no recent follow requests available in this export.",
  },
  lostFollowers: {
    title: "No lost followers found",
    description:
      "No accounts from the previous follower list are missing in the current export.",
  },
  newFollowers: {
    title: "No new followers found",
    description:
      "No accounts appear in the current follower list that were missing from the previous export.",
  },
};

const tabInfoByTab: Record<TabKey, ResultsTabInfo> = {
  mutual: {
    sectionTitle: "Mutual connections",
    description: "People you follow who also follow you back.",
  },
  followersOnly: {
    sectionTitle: "Follower",
    description: "People who follow you, but you don't follow back.",
  },
  unfollowers: {
    sectionTitle: "Following",
    description: "People you follow, but who don't follow you back.",
  },
  recentUnfollowers: {
    sectionTitle: "Recent unfollowers",
    description: "People who recently unfollowed you.",
  },
  blocked: {
    sectionTitle: "Blocked users",
    description: "People you have blocked on Instagram.",
  },
  restricted: {
    sectionTitle: "Restricted users",
    description:
      "People you have restricted. They can still see your content, but their activity is limited.",
  },
  closeFriends: {
    sectionTitle: "Close friends",
    description:
      "People in your Close Friends list who can see your private stories.",
  },
  hideStoriesFrom: {
    sectionTitle: "Hidden stories",
    description: "People you have hidden your stories from.",
  },
  pendingFollowRequests: {
    sectionTitle: "Pending follow requests",
    description: "People you have requested to follow.",
  },
  recentFollowRequests: {
    sectionTitle: "Recent follow requests",
    description: "Recent accounts involved in follow request activity.",
  },
  lostFollowers: {
    sectionTitle: "Lost followers",
    description:
      "People who were followers in the previous export and are missing from the current export.",
  },
  newFollowers: {
    sectionTitle: "New followers",
    description:
      "People who are followers in the current export and were missing from the previous export.",
  },
};

const searchEmptyState: ResultsEmptyState = {
  title: "No users match your search",
  description: "Try a different username or clear your search.",
};

export function getResultsEmptyState({
  activeTab,
  hasUsersInCurrentTab,
  hasSearchQuery,
  hasFilteredUsers,
}: {
  activeTab: TabKey;
  hasUsersInCurrentTab: boolean;
  hasSearchQuery: boolean;
  hasFilteredUsers: boolean;
}): ResultsEmptyState | null {
  if (!hasUsersInCurrentTab) {
    return emptyStatesByTab[activeTab];
  }

  if (hasSearchQuery && !hasFilteredUsers) {
    return searchEmptyState;
  }

  return null;
}

export function getResultsTabInfo(activeTab: TabKey): ResultsTabInfo {
  return tabInfoByTab[activeTab];
}
