import { InstagramObjectArrayKeys } from "@/types/enums";
import type {
  InstagramRawRelationshipObject,
  InstagramRawUser,
  InstagramUser,
} from "@/types/instagram.types";
import { isNumber, isObject, isString } from "../typeGuards";

export function isJsonFile(path: string): boolean {
  return path.endsWith(".json");
}

export function isFollowersFile(path: string): boolean {
  return /(^|\/)connections\/followers_and_following\/followers(\.json|_\d+\.json)$/.test(
    path,
  );
}

export function isFollowingFile(path: string): boolean {
  return /(^|\/)connections\/followers_and_following\/following(\.json|_\d+\.json)$/.test(
    path,
  );
}

export function isRecentlyUnfollowedFile(path: string): boolean {
  return /(^|\/)connections\/followers_and_following\/recently_unfollowed_(profiles|accounts)\.json$/.test(
    path,
  );
}

export function isPendingFollowRequestsFile(path: string): boolean {
  return /(^|\/)connections\/followers_and_following\/pending_follow_requests\.json$/.test(
    path,
  );
}

export function isRecentFollowRequestsFile(path: string): boolean {
  return /(^|\/)connections\/followers_and_following\/recent_follow_requests\.json$/.test(
    path,
  );
}

export function isBlockedFile(path: string): boolean {
  return /(^|\/)connections\/followers_and_following\/blocked_(profiles|accounts)\.json$/.test(
    path,
  );
}

export function isCloseFriendsFile(path: string): boolean {
  return /(^|\/)connections\/followers_and_following\/close_(friends|accounts)\.json$/.test(
    path,
  );
}

export function isHideStoriesFromFile(path: string): boolean {
  return /(^|\/)connections\/followers_and_following\/hide_story_(from|accounts)\.json$/.test(
    path,
  );
}

export function isRestrictedFile(path: string): boolean {
  return /(^|\/)connections\/followers_and_following\/restricted_(profiles|accounts)\.json$/.test(
    path,
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
  value: unknown,
): value is InstagramRawRelationshipObject {
  return isObject(value);
}

/**
 * Normalizes a raw Instagram user object to the app's internal format
 */
export function normalizeInstagramUser(raw: InstagramRawUser): InstagramUser {
  return {
    username: raw.value,
    href: raw.href,
    timestamp: raw.timestamp,
  };
}

/**
 * Generates the Instagram profile URL for a given user
 */
export function getInstagramProfileUrl(user: InstagramUser): string {
  return `https://www.instagram.com/${user.username}/`;
}

/**
 * Checks if a given array key is a valid Instagram object array key
 * @param arrKey name of the array key of the object
 * @returns true if arrKey is the same of some value placed in InstagramObjectArrayKeys
 */
export function isInstagramArrayKeyPresent(arrKey: string): boolean {
  return Object.values(InstagramObjectArrayKeys).some((key) => key === arrKey);
}
