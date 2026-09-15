import { InstagramObjectArrayKeys } from "@/types/enums";

// Minimal, anonymized Instagram export fixtures used only for tests.
// Usernames are fictional (user_01, user_02, ...) - never real account data.
// Both fixtures describe the same underlying people so parsing either
// format must normalize to the same set of usernames.

const TIMESTAMP = 1_700_000_000;

function legacyEntry(username: string) {
  return {
    title: "",
    media_list_data: [],
    string_list_data: [
      {
        href: `https://www.instagram.com/${username}/`,
        value: username,
        timestamp: TIMESTAMP,
      },
    ],
  };
}

function labelValuesEntry(username: string) {
  return {
    title: username,
    timestamp: TIMESTAMP,
    label_values: [
      { label: "Username", value: username },
      { label: "URL", value: `https://www.instagram.com/${username}/` },
    ],
  };
}

export const FIXTURE_FOLLOWERS = ["user_01", "user_02", "user_03", "user_04"];
export const FIXTURE_FOLLOWING = ["user_02", "user_03", "user_05"];
export const FIXTURE_RECENTLY_UNFOLLOWED = ["user_06"];
export const FIXTURE_BLOCKED = ["user_07"];

// Historical export shape: each relationship entry carries `string_list_data`.
export const legacyStringListExportFiles: Record<string, unknown> = {
  "connections/followers_and_following/followers_1.json":
    FIXTURE_FOLLOWERS.map(legacyEntry),
  "connections/followers_and_following/following.json": {
    [InstagramObjectArrayKeys.FOLLOWING]: FIXTURE_FOLLOWING.map(legacyEntry),
  },
  "connections/followers_and_following/recently_unfollowed_profiles.json": {
    [InstagramObjectArrayKeys.UNFOLLOWED_USERS]:
      FIXTURE_RECENTLY_UNFOLLOWED.map(legacyEntry),
  },
  "connections/followers_and_following/blocked_profiles.json": {
    [InstagramObjectArrayKeys.BLOCKED_USERS]: FIXTURE_BLOCKED.map(legacyEntry),
  },
};

// Newer export shape: each relationship entry carries `label_values` instead.
export const labelValuesExportFiles: Record<string, unknown> = {
  "connections/followers_and_following/followers_1.json":
    FIXTURE_FOLLOWERS.map(labelValuesEntry),
  "connections/followers_and_following/following.json": {
    [InstagramObjectArrayKeys.FOLLOWING]:
      FIXTURE_FOLLOWING.map(labelValuesEntry),
  },
  "connections/followers_and_following/recently_unfollowed_accounts.json": {
    [InstagramObjectArrayKeys.UNFOLLOWED_USERS]:
      FIXTURE_RECENTLY_UNFOLLOWED.map(labelValuesEntry),
  },
  "connections/followers_and_following/blocked_accounts.json": {
    [InstagramObjectArrayKeys.BLOCKED_USERS]:
      FIXTURE_BLOCKED.map(labelValuesEntry),
  },
};
