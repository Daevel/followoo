import type {
  InstagramAnalysisResult,
  InstagramUser,
  UserPersona,
  UserWithPersona,
} from "../../types/instagram.types";

function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

export function classifyUserPersona(
  user: InstagramUser,
  analysis: InstagramAnalysisResult,
): UserPersona {
  const normalizedUsername = normalizeUsername(user.username);

  // Check Close Friends first (highest priority)
  if (
    analysis.closeFriends.some(
      (u) => normalizeUsername(u.username) === normalizedUsername,
    )
  ) {
    return "SUPER_FAN";
  }

  // Check Recently Unfollowed
  if (
    analysis.recentUnfollowers.some(
      (u) => normalizeUsername(u.username) === normalizedUsername,
    )
  ) {
    return "FICKLE";
  }

  // Check Mutual
  if (
    analysis.mutual.some(
      (u) => normalizeUsername(u.username) === normalizedUsername,
    )
  ) {
    return "ENGAGED";
  }

  // Check Followers Only (Lurkers)
  if (
    analysis.followersOnly.some(
      (u) => normalizeUsername(u.username) === normalizedUsername,
    )
  ) {
    return "LURKER";
  }

  // Check Unfollowers (Dormant)
  if (
    analysis.unfollowers.some(
      (u) => normalizeUsername(u.username) === normalizedUsername,
    )
  ) {
    return "DORMANT";
  }

  // Default to LURKER for unknown
  return "LURKER";
}

export function addPersonasToUsers(
  users: InstagramUser[],
  analysis: InstagramAnalysisResult,
): UserWithPersona[] {
  return users.map((user) => ({
    ...user,
    persona: classifyUserPersona(user, analysis),
  }));
}

export function groupUsersByPersona(
  users: InstagramUser[],
  analysis: InstagramAnalysisResult,
): Record<UserPersona, number> {
  const usersWithPersona = addPersonasToUsers(users, analysis);

  const personaCounts: Record<UserPersona, number> = {
    SUPER_FAN: 0,
    ENGAGED: 0,
    FICKLE: 0,
    LURKER: 0,
    DORMANT: 0,
  };

  usersWithPersona.forEach((user) => {
    personaCounts[user.persona]++;
  });

  return personaCounts;
}
