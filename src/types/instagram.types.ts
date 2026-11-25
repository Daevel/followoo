// RAW TYPES

export type InstagramRawUser = {
  value: string;
  href?: string;
  timestamp?: number;
};

export type InstagramRawRelationshipObject = {
  title?: unknown;
  timestamp?: unknown;
  label_values?: unknown;
  media_list_data?: unknown;
  string_list_data?: unknown;
};

export type JsonObject = Record<string, unknown>;

// DOMAIN TYPES

export type InstagramUser = {
  username: string;
  href?: string;
  timestamp?: number;
};

export type InstagramRelationshipObject = {
  media_list_data: string[];
  string_list_data: InstagramUser[];
  title: string;
};

export type InstagramExportData = {
  followers: InstagramUser[];
  following: InstagramUser[];
  recentlyUnfollowed: InstagramUser[];
  blocked: InstagramUser[];
  pendingFollowRequests: InstagramUser[];
  recentFollowRequests: InstagramUser[];
  restricted: InstagramUser[];
  closeFriends: InstagramUser[];
  hideStoriesFrom: InstagramUser[];
};

// Field names are kept as they are: encrypted history snapshots store this
// shape, so renaming a field would break every snapshot saved before.
// The names are legacy; the comments say what each list really holds.
export type InstagramAnalysisResult = {
  /** You follow each other. */
  mutual: InstagramUser[];
  /** They follow you, you don't follow them ("You don't follow back"). */
  followersOnly: InstagramUser[];
  /**
   * You follow them, they don't follow you ("Don't follow you back"). Mixes
   * people who unfollowed you with people who never followed you: one
   * export can't tell them apart, only a comparison of two exports can.
   */
  unfollowers: InstagramUser[];
  /**
   * Accounts the user recently stopped following ("You unfollowed"), from
   * Instagram's recently_unfollowed file. Not people who unfollowed the user.
   */
  recentUnfollowers: InstagramUser[];
  blocked: InstagramUser[];
  restricted: InstagramUser[];
  closeFriends: InstagramUser[];
  hideStoriesFrom: InstagramUser[];
  pendingFollowRequests: InstagramUser[];
  recentFollowRequests: InstagramUser[];
  sourceCounts: {
    followers: number;
    following: number;
  };
};
