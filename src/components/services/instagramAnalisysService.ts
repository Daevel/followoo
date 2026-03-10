import type {
  InstagramExportData,
  InstagramUser,
} from "../../types/instagram.types";

export type InstagramAnalysisResult = {
  mutual: InstagramUser[];
  followersOnly: InstagramUser[];
  unfollowers: InstagramUser[];
  recentUnfollowers: InstagramUser[];
  blocked: InstagramUser[];
};

function normalize(username: string) {
  return username.trim().toLowerCase();
}

export function analyzeInstagramExport(
  data: InstagramExportData,
): InstagramAnalysisResult {
  const followers = data.followers;
  const following = data.following;

  const followersSet = new Set(
    followers.map((user) => normalize(user.username)),
  );

  const followingSet = new Set(
    following.map((user) => normalize(user.username)),
  );

  // X segue Y e Y segue X
  const mutual = followers.filter((user) =>
    followingSet.has(normalize(user.username)),
  );

  // Y segue X ma X non segue Y
  const followersOnly = followers.filter(
    (user) => !followingSet.has(normalize(user.username)),
  );

  // X segue Y ma Y non segue X
  const unfollowers = following.filter(
    (user) => !followersSet.has(normalize(user.username)),
  );

  return {
    mutual,
    followersOnly,
    unfollowers,
    recentUnfollowers: data.recentlyUnfollowed,
    blocked: data.blocked,
  };
}