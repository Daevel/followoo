export type InstagramUser = {
  username: string;
  href?: string;
  timestamp?: number;
};

export type InstagramExportData = {
  followers: InstagramUser[];
  following: InstagramUser[];
  recentlyUnfollowed: InstagramUser[];
  blocked: InstagramUser[];
  pendingFollowRequests: InstagramUser[];
  recentFollowRequests: InstagramUser[];
  restricted: InstagramUser[];
};

export type InstagramAnalysisResult = {
  mutual: InstagramUser[];
  followersOnly: InstagramUser[];
  unfollowers: InstagramUser[];
  recentUnfollowers: InstagramUser[];
  blocked: InstagramUser[];
};

export type JsonObject = Record<string, unknown>;