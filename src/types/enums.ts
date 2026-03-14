export const InstagramObjectArrayKeys = {
  FOLLOWING: "relationships_following",
  HIDE_STORIES_FROM: "relationships_hide_stories_from",
  FOLLOW_REQUESTS_SENT: "relationships_follow_requests_sent",
  PERMANENT_FOLLOW_REQUESTS: "relationships_following_permanent_follow_requests",
  UNFOLLOWED_USERS: "relationships_unfollowed_users",
  DISMISSED_SUGGESTED_USERS: "relationships_dismissed_suggested_users",
  RESTRICTED_USERS: "relationships_restricted_users",
  BLOCKED_USERS: "relationships_blocked_users",
  CLOSE_FRIENDS: "relationships_close_friends",
} as const;

export type InstagramObjectArrayKeys =
  typeof InstagramObjectArrayKeys[keyof typeof InstagramObjectArrayKeys];