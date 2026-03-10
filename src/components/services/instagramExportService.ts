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

type ParseInstagramExportOptions = {
  debug?: boolean;
};

function debugLog(enabled: boolean, ...args: unknown[]) {
  if (enabled) {
    console.log("[instagramExportService]", ...args);
  }
}

function safeJsonParse(
  content: string,
  path: string,
  debug: boolean,
): unknown | null {
  try {
    return JSON.parse(content);
  } catch (error) {
    debugLog(debug, `Failed to parse JSON for file: ${path}`, error);
    return null;
  }
}

export async function parseInstagramExport(
  file: File,
  options: ParseInstagramExportOptions = {},
): Promise<InstagramExportData> {
  const debug = options.debug ?? true;

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

  debugLog(debug, "Detected ZIP files:", paths);

  for (const path of paths) {
    const entry = zip.files[path];

    if (entry.dir) continue;
    if (!isJsonFile(path)) continue;

    debugLog(debug, "Reading JSON file:", path);

    const content = await entry.async("string");
    const json = safeJsonParse(content, path, debug);

    if (json === null) {
      continue;
    }

    if (isFollowersFile(path)) {
      console.log("MATCHED FOLLOWERS FILE:", path);
      const parsed = parseFollowers(json);
      console.log("FOLLOWERS PARSED FROM FILE:", path, parsed.length);
      result.followers.push(...parsed);
      continue;
    }

    if (isFollowingFile(path)) {
      const parsed = parseFollowing(json);
      result.following.push(...parsed);
      debugLog(debug, `Parsed following from ${path}:`, parsed.length);
      continue;
    }

    if (isRecentlyUnfollowedFile(path)) {
      const parsed = parseWrappedRelationshipUsers(
        json,
        "relationships_unfollowed_users",
      );
      result.recentlyUnfollowed.push(...parsed);
      debugLog(
        debug,
        `Parsed recently unfollowed from ${path}:`,
        parsed.length,
      );
      continue;
    }

    if (isPendingFollowRequestsFile(path)) {
      const parsed = parseFollowers(json);
      result.pendingFollowRequests.push(...parsed);
      debugLog(debug, `Parsed pending requests from ${path}:`, parsed.length);
      continue;
    }

    if (isRecentFollowRequestsFile(path)) {
      const parsed = parseFollowers(json);
      result.recentFollowRequests.push(...parsed);
      debugLog(
        debug,
        `Parsed recent follow requests from ${path}:`,
        parsed.length,
      );
      continue;
    }

    if (isBlockedFile(path)) {
      const parsed = parseWrappedRelationshipUsers(
        json,
        "relationships_blocked_users",
      );
      result.blocked.push(...parsed);
      debugLog(debug, `Parsed blocked from ${path}:`, parsed.length);
      continue;
    }

    if (isRestrictedFile(path)) {
      const parsed = parseFollowers(json);
      result.restricted.push(...parsed);
      debugLog(debug, `Parsed restricted from ${path}:`, parsed.length);
      continue;
    }

    debugLog(debug, "Skipped unsupported JSON file:", path);
  }

  debugLog(debug, "Final parsed result:", result);

  return result;
}
