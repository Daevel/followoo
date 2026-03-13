import type {
  InstagramAnalysisResult,
  InstagramExportData,
  InstagramUser,
} from "../../types/instagram.types";

function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

function dedupeUsers(users: InstagramUser[]): InstagramUser[] {
  const map = new Map<string, InstagramUser>();

  for (const user of users) {
    const key = normalizeUsername(user.username);

    if (!map.has(key)) {
      map.set(key, user);
    }
  }

  return Array.from(map.values());
}

export function analyzeInstagramExport(
  data: InstagramExportData,
): InstagramAnalysisResult {
  const followers = dedupeUsers(data.followers);
  const following = dedupeUsers(data.following);
  const recentUnfollowers = dedupeUsers(data.recentlyUnfollowed);
  const blocked = dedupeUsers(data.blocked);
  const restricted = dedupeUsers(data.restricted);

  const followerMap = new Map(
    followers.map((user) => [normalizeUsername(user.username), user]),
  );

  const followingMap = new Map(
    following.map((user) => [normalizeUsername(user.username), user]),
  );

  const mutual = followers.filter((user) =>
    followingMap.has(normalizeUsername(user.username)),
  );

  const followersOnly = followers.filter(
    (user) => !followingMap.has(normalizeUsername(user.username)),
  );

  const unfollowers = following.filter(
    (user) => !followerMap.has(normalizeUsername(user.username)),
  );

  return {
    mutual,
    followersOnly,
    unfollowers,
    recentUnfollowers,
    blocked,
    restricted,
  };
}
