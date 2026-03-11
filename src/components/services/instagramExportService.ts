import JSZip from "jszip";

import type { InstagramExportData } from "../../types/instagram.types";
import { parseFollowers } from "../parsers/parseFollowers";
import { parseFollowing } from "../parsers/parseFollowing";
import { parseWrappedRelationshipUsers } from "../parsers/parseWrappedRelationshipUsers";

import {
  isBlockedFile,
  isFollowersFile,
  isFollowingFile,
  isJsonFile,
  isPendingFollowRequestsFile,
  isRecentFollowRequestsFile,
  isRecentlyUnfollowedFile,
  isRestrictedFile,
} from "./../utils/instagramExportMatchers";

function safeJsonParse(content: string): unknown | null {
  try {
    return JSON.parse(content);
  } catch {
    return null;
  }
}

export async function parseInstagramExport(
  file: File,
): Promise<InstagramExportData> {

  const zip = await JSZip.loadAsync(file);

  const result: InstagramExportData = {
    followers: [],
    following: [],
    recentlyUnfollowed: [],
    pendingFollowRequests: [],
    recentFollowRequests: [],
    blocked: [],
    restricted: [],
  };

  const paths = Object.keys(zip.files);

  for (const path of paths) {
    const entry = zip.files[path];

    if (entry.dir) continue;
    if (!isJsonFile(path)) continue;

    const content = await entry.async("string");
    const json = safeJsonParse(content);

    if (json === null) {
      continue;
    }

    if (isFollowersFile(path)) {
      const parsed = parseFollowers(json);
      result.followers.push(...parsed);
      continue;
    }

    if (isFollowingFile(path)) {
      const parsed = parseFollowing(json);
      result.following.push(...parsed);
      continue;
    }

    if (isRecentlyUnfollowedFile(path)) {
      const parsed = parseWrappedRelationshipUsers(
        json,
        "relationships_unfollowed_users",
      );
      result.recentlyUnfollowed.push(...parsed);
      continue;
    }

    if (isPendingFollowRequestsFile(path)) {
      const parsed = parseFollowers(json);
      result.pendingFollowRequests.push(...parsed);
      continue;
    }

    if (isRecentFollowRequestsFile(path)) {
      const parsed = parseFollowers(json);
      result.recentFollowRequests.push(...parsed);
      continue;
    }

    if (isBlockedFile(path)) {
      const parsed = parseWrappedRelationshipUsers(
        json,
        "relationships_blocked_users",
      );
      result.blocked.push(...parsed);
      continue;
    }

    if (isRestrictedFile(path)) {
      const parsed = parseFollowers(json);
      result.restricted.push(...parsed);
      continue;
    }
  }

  return result;
}