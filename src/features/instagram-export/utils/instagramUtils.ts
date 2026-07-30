import { isNumber, isObject, isString } from "@/lib/typeGuards";
import { InstagramObjectArrayKeys } from "@/types/enums";
import type {
  InstagramRawRelationshipObject,
  InstagramRawUser,
  InstagramUser,
} from "@/types/instagram.types";

export function isJsonFile(path: string): boolean {
  return path.endsWith(".json");
}

export function isFollowersFile(path: string): boolean {
  return /(^|\/)connections\/followers_and_following\/followers(\.json|_\d+\.json)$/.test(
    path
  );
}

export function isFollowingFile(path: string): boolean {
  return /(^|\/)connections\/followers_and_following\/following(\.json|_\d+\.json)$/.test(
    path
  );
}

export function isRecentlyUnfollowedFile(path: string): boolean {
  return /(^|\/)connections\/followers_and_following\/recently_unfollowed_(profiles|accounts)\.json$/.test(
    path
  );
}

export function isPendingFollowRequestsFile(path: string): boolean {
  return /(^|\/)connections\/followers_and_following\/pending_follow_requests\.json$/.test(
    path
  );
}

export function isRecentFollowRequestsFile(path: string): boolean {
  return /(^|\/)connections\/followers_and_following\/recent_follow_requests\.json$/.test(
    path
  );
}

export function isBlockedFile(path: string): boolean {
  return /(^|\/)connections\/followers_and_following\/blocked_(profiles|accounts)\.json$/.test(
    path
  );
}

export function isCloseFriendsFile(path: string): boolean {
  return /(^|\/)connections\/followers_and_following\/close_(friends|accounts)\.json$/.test(
    path
  );
}

export function isHideStoriesFromFile(path: string): boolean {
  return /(^|\/)connections\/followers_and_following\/hide_story_(from|accounts)\.json$/.test(
    path
  );
}

export function isRestrictedFile(path: string): boolean {
  return /(^|\/)connections\/followers_and_following\/restricted_(profiles|accounts)\.json$/.test(
    path
  );
}

export function isRawInstagramUser(value: unknown): value is InstagramRawUser {
  if (!isObject(value)) return false;

  const { value: username, href, timestamp } = value;

  return (
    isString(username) &&
    (href === undefined || isString(href)) &&
    (timestamp === undefined || isNumber(timestamp))
  );
}

export function isInstagramUser(value: unknown): value is InstagramUser {
  if (!isObject(value)) return false;

  return (
    isString(value.value) &&
    (value.href === undefined || isString(value.href)) &&
    (value.timestamp === undefined || isNumber(value.timestamp))
  );
}

export function isRelationshipObject(
  value: unknown
): value is InstagramRawRelationshipObject {
  return isObject(value);
}

export function normalizeInstagramUser(raw: InstagramRawUser): InstagramUser {
  return {
    username: raw.value,
    href: raw.href,
    timestamp: raw.timestamp,
  };
}

export function getInstagramProfileUrl(user: InstagramUser): string {
  return `https://www.instagram.com/${user.username}/`;
}

export function isInstagramArrayKeyPresent(arrKey: string): boolean {
  return Object.values(InstagramObjectArrayKeys).some((key) => key === arrKey);
}
