// RAW TYPES

export type InstagramRawUser = {
  value: string;
  href?: string;
  timestamp?: number;
};

export type InstagramRawRelationshipObject = {
  title?: unknown;
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

export type InstagramAnalysisResult = {
  mutual: InstagramUser[];
  followersOnly: InstagramUser[];
  unfollowers: InstagramUser[];
  recentUnfollowers: InstagramUser[];
  blocked: InstagramUser[];
  restricted: InstagramUser[];
  closeFriends: InstagramUser[];
  hideStoriesFrom: InstagramUser[];
};
