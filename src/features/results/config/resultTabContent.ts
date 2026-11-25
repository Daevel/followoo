import type {
  ResultsEmptyState,
  ResultsTabInfo,
  TabKey,
} from "../types/results.types";

const emptyStatesByTab: Record<TabKey, ResultsEmptyState> = {
  mutual: {
    title: "No mutual connections yet",
    description: "Nobody in this export follows you while you follow them.",
  },
  followersOnly: {
    title: "You follow back everyone",
    description: "Everyone who follows you is someone you follow too.",
  },
  unfollowers: {
    title: "Everyone follows you back",
    description: "Everyone you follow also follows you.",
  },
  recentUnfollowers: {
    title: "No recent unfollows",
    description: "Instagram lists no accounts you recently stopped following.",
  },
  blocked: {
    title: "No blocked accounts",
    description: "You haven't blocked anyone, according to this export.",
  },
  restricted: {
    title: "No restricted accounts",
    description: "You haven't restricted anyone, according to this export.",
  },
  closeFriends: {
    title: "No Close Friends",
    description: "Your Close Friends list is empty in this export.",
  },
  hideStoriesFrom: {
    title: "Your stories are hidden from no one",
    description: "This export lists nobody you hide your stories from.",
  },
  pendingFollowRequests: {
    title: "No requests waiting",
    description: "You have no follow requests waiting to be accepted.",
  },
  recentFollowRequests: {
    title: "No recent follow requests found",
    description:
      "There are no recent follow requests available in this export.",
  },
};

// Each list says who is in it from the user's side, so its name never
// needs a glossary. "Followers" and "Following" are kept for the totals.
const tabInfoByTab: Record<TabKey, ResultsTabInfo> = {
  mutual: {
    sectionTitle: "Mutual",
    description: "You follow each other.",
  },
  followersOnly: {
    sectionTitle: "You don't follow back",
    description: "They follow you, but you don't follow them.",
  },
  unfollowers: {
    sectionTitle: "Don't follow you back",
    description:
      "You follow them, but they don't follow you. This includes people who unfollowed you and people who never followed you back.",
  },
  recentUnfollowers: {
    sectionTitle: "You unfollowed",
    description:
      "Accounts you recently stopped following, as listed by Instagram.",
  },
  blocked: {
    sectionTitle: "Blocked",
    description:
      "Accounts you blocked. They can't see your profile or message you.",
  },
  restricted: {
    sectionTitle: "Restricted",
    description:
      "Accounts you restricted. Their new comments on your posts are visible only to them, and their messages go to your requests.",
  },
  closeFriends: {
    sectionTitle: "Close Friends",
    description:
      "Your Close Friends list: they can see the stories you share with Close Friends.",
  },
  hideStoriesFrom: {
    sectionTitle: "Hidden from your stories",
    description: "Accounts that can't see your stories.",
  },
  pendingFollowRequests: {
    sectionTitle: "Requests you sent",
    description:
      "Follow requests you sent to private accounts that haven't been accepted yet.",
  },
  // Not shown in the list menu until we know whether Instagram lists
  // requests you sent or received here.
  recentFollowRequests: {
    sectionTitle: "Recent follow requests",
    description: "Recent follow request activity listed by Instagram.",
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
