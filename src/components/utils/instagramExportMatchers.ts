export function isJsonFile(path: string): boolean {
  return path.toLowerCase().endsWith(".json");
}

export function isFollowersFile(path: string): boolean {
  return /(^|\/)connections\/followers_and_following\/followers_\d+\.json$/i.test(
    path,
  );
}

export function isFollowingFile(path: string): boolean {
  return /(^|\/)connections\/followers_and_following\/following(\.json|_\d+\.json)$/i.test(
    path,
  );
}

export function isRecentlyUnfollowedFile(path: string): boolean {
  return /(^|\/)connections\/followers_and_following\/recently_unfollowed_(profiles|accounts)\.json$/i.test(
    path,
  );
}

export function isPendingFollowRequestsFile(path: string): boolean {
  return /(^|\/)connections\/followers_and_following\/pending_follow_requests\.json$/i.test(
    path,
  );
}

export function isRecentFollowRequestsFile(path: string): boolean {
  return /(^|\/)connections\/followers_and_following\/recent_follow_requests\.json$/i.test(
    path,
  );
}

export function isBlockedFile(path: string): boolean {
  return /(^|\/)connections\/followers_and_following\/blocked_(profiles|accounts)\.json$/i.test(
    path,
  );
}

export function isRestrictedFile(path: string): boolean {
  return /(^|\/)connections\/followers_and_following\/restricted_(profiles|accounts)\.json$/i.test(
    path,
  );
}