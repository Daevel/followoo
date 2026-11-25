import type { TabKey } from "../types/results.types";

/** Readable `#hash` for each list, so the open list survives Back/reload. */
export const LIST_HASHES: Record<TabKey, string> = {
  mutual: "mutual",
  unfollowers: "dont-follow-you-back",
  followersOnly: "you-dont-follow-back",
  recentUnfollowers: "you-unfollowed",
  blocked: "blocked",
  restricted: "restricted",
  closeFriends: "close-friends",
  hideStoriesFrom: "hidden-from-your-stories",
  pendingFollowRequests: "requests-you-sent",
  recentFollowRequests: "recent-follow-requests",
};

/** Lists that can be opened from a link; hidden lists are left out. */
const LINKABLE: TabKey[] = [
  "mutual",
  "unfollowers",
  "followersOnly",
  "recentUnfollowers",
  "blocked",
  "restricted",
  "closeFriends",
  "hideStoriesFrom",
  "pendingFollowRequests",
];

export function tabFromHash(hash: string): TabKey | null {
  const slug = hash.replace(/^#/, "");
  return LINKABLE.find((tab) => LIST_HASHES[tab] === slug) ?? null;
}
