import type {
  FollowerSnapshotDiff,
  InstagramExportData,
  InstagramUser,
} from "@/types/instagram.types";

function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

function dedupeUsers(users: InstagramUser[]): InstagramUser[] {
  const map = new Map<string, InstagramUser>();

  for (const user of users) {
    const normalized = normalizeUsername(user.username);

    if (!normalized || map.has(normalized)) continue;

    map.set(normalized, user);
  }

  return Array.from(map.values());
}

export function compareFollowerSnapshots(
  previousExport: InstagramExportData,
  currentExport: InstagramExportData
): FollowerSnapshotDiff {
  const previousFollowers = dedupeUsers(previousExport.followers);
  const currentFollowers = dedupeUsers(currentExport.followers);
  const previousFollowerMap = new Map(
    previousFollowers.map((user) => [normalizeUsername(user.username), user])
  );
  const currentFollowerMap = new Map(
    currentFollowers.map((user) => [normalizeUsername(user.username), user])
  );

  return {
    previousFollowersCount: previousFollowers.length,
    currentFollowersCount: currentFollowers.length,
    lostFollowers: previousFollowers.filter(
      (user) => !currentFollowerMap.has(normalizeUsername(user.username))
    ),
    newFollowers: currentFollowers.filter(
      (user) => !previousFollowerMap.has(normalizeUsername(user.username))
    ),
  };
}
