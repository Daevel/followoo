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
  isHideStoriesFromFile,
} from "./../utils/instagramExportMatchers";
import { AppError, ERROR_CODES } from "../../errors";

function safeJsonParse(content: string): unknown | null {
  try {
    return JSON.parse(content);
  } catch {
    return null;
  }
}

function hasAnyParsedData(data: InstagramExportData): boolean {
  return (
    data.followers.length > 0 ||
    data.following.length > 0 ||
    data.recentlyUnfollowed.length > 0 ||
    data.pendingFollowRequests.length > 0 ||
    data.recentFollowRequests.length > 0 ||
    data.blocked.length > 0 ||
    data.restricted.length > 0 ||
    data.closeFriends.length > 0 ||
    data.hideStoriesFrom.length > 0
  );
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
  let zip: JSZip;

  try {
    zip = await JSZip.loadAsync(file);
  } catch (error) {
    throw new AppError({
      code: ERROR_CODES.INVALID_ZIP_FILE,
      message: "Failed to load ZIP file",
      userMessage: "The uploaded file is not a valid ZIP file.",
      details: error,
    });
  }

  const result = createEmptyInstagramExportData();
  const paths = Object.keys(zip.files);

  for (const path of paths) {
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
          InstagramObjectArrayKeys.FOLLOWING,
        ),
      );
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

  if (!hasAnyParsedData(result)) {
    throw new AppError({
      code: ERROR_CODES.INVALID_INSTAGRAM_EXPORT,
      message: "No supported Instagram relationship data found",
      userMessage:
        "This ZIP file does not look like a valid Instagram export, or it does not contain supported relationship data.",
      details: { fileName: file.name },
    });
  }

  return result;
}
