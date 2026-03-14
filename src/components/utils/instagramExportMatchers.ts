export function isJsonFile(path: string): boolean {
  return path.endsWith(".json");
}

export function isFollowersFile(path: string): boolean {
  return /(^|\/)connections\/followers_and_following\/followers(\.json|_\d+\.json)$/.test(path);
}

export function isFollowingFile(path: string): boolean {
  return /(^|\/)connections\/followers_and_following\/following(\.json|_\d+\.json)$/.test(path);
}

export function isRecentlyUnfollowedFile(path: string): boolean {
  return /(^|\/)connections\/followers_and_following\/recently_unfollowed_(profiles|accounts)\.json$/.test(path);
}

export function isPendingFollowRequestsFile(path: string): boolean {
  return /(^|\/)connections\/followers_and_following\/pending_follow_requests\.json$/.test(path);
}

export function isRecentFollowRequestsFile(path: string): boolean {
  return /(^|\/)connections\/followers_and_following\/recent_follow_requests\.json$/.test(path);
}

export function isBlockedFile(path: string): boolean {
  return /(^|\/)connections\/followers_and_following\/blocked_(profiles|accounts)\.json$/.test(path);
}

export function isCloseFriendsFile(path: string): boolean {
  return /(^|\/)connections\/followers_and_following\/close_(friends|accounts)\.json$/.test(path);
}

export function isHideStoriesFromFile(path: string): boolean {
    return /(^|\/)connections\/followers_and_following\/hide_story_(from|accounts)\.json$/.test(path);
}

export function isRestrictedFile(path: string): boolean {
  return /(^|\/)connections\/followers_and_following\/restricted_(profiles|accounts)\.json$/.test(path);
}