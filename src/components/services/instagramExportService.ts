import JSZip from "jszip";

import type { InstagramExportData } from "../../types/instagram.types";
import { InstagramObjectArrayKeys } from "../../types/enums";
import { parseFollowers } from "../parsers/parseFollowers";
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
  isCloseFriendsFile,
  isHideStoriesFromFile
} from "./../utils/instagramExportMatchers";

function safeJsonParse(content: string): unknown | null {
  try {
    return JSON.parse(content);
  } catch {
    return null;
  }
}

function createEmptyInstagramExportData(): InstagramExportData {
  return {
    followers: [],
    following: [],
    recentlyUnfollowed: [],
    pendingFollowRequests: [],
    recentFollowRequests: [],
    blocked: [],
    restricted: [],
    closeFriends: [],
    hideStoriesFrom: [],
  };
}

export async function parseInstagramExport(
  file: File,
): Promise<InstagramExportData> {
  const zip = await JSZip.loadAsync(file);
  const result = createEmptyInstagramExportData();

  for (const path of Object.keys(zip.files)) {
    const entry = zip.files[path];

    if (!entry || entry.dir || !isJsonFile(path)) continue;

    const content = await entry.async("string");
    const json = safeJsonParse(content);

    if (json === null) continue;

    if (isFollowersFile(path)) {
      result.followers.push(...parseFollowers(json));
      continue;
    }

    if (isFollowingFile(path)) {
     result.following.push(
      ...parseWrappedRelationshipUsers(
        json,
        InstagramObjectArrayKeys.FOLLOWING
      )
     )
     continue;
    }

    if (isRecentlyUnfollowedFile(path)) {
      result.recentlyUnfollowed.push(
        ...parseWrappedRelationshipUsers(
          json,
          InstagramObjectArrayKeys.UNFOLLOWED_USERS,
        ),
      );
      continue;
    }

    if (isBlockedFile(path)) {
      result.blocked.push(
        ...parseWrappedRelationshipUsers(
          json,
          InstagramObjectArrayKeys.BLOCKED_USERS,
        ),
      );
      continue;
    }

    if (isRestrictedFile(path)) {
      result.restricted.push(
        ...parseWrappedRelationshipUsers(
          json,
          InstagramObjectArrayKeys.RESTRICTED_USERS,
        ),
      );
      continue;
    }

        if (isCloseFriendsFile(path)) {
      result.closeFriends.push(
        ...parseWrappedRelationshipUsers(
          json,
          InstagramObjectArrayKeys.CLOSE_FRIENDS,
        ),
      );
      continue;
    }

            if (isHideStoriesFromFile(path)) {
      result.hideStoriesFrom.push(
        ...parseWrappedRelationshipUsers(
          json,
          InstagramObjectArrayKeys.HIDE_STORIES_FROM,
        ),
      );
      continue;
    }

    if (isPendingFollowRequestsFile(path)) {
      result.pendingFollowRequests.push(
        ...parseWrappedRelationshipUsers(
          json,
          InstagramObjectArrayKeys.PERMANENT_FOLLOW_REQUESTS,
        ),
      );
      continue;
    }

    if (isRecentFollowRequestsFile(path)) {
      result.recentFollowRequests.push(...parseFollowers(json));
    }
  }

  return result;
}
