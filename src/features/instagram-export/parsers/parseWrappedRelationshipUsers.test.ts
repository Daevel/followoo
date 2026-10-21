import { describe, expect, it } from "vitest";
import { InstagramObjectArrayKeys } from "@/types/enums";
import { parseWrappedRelationshipUsers } from "./parseWrappedRelationshipUsers";

// Real Instagram `label_values` entries (blocked, restricted, close
// friends, hide story from, pending/recent follow requests, recently
// unfollowed) carry exactly these three labels, in this order, in
// whatever language the export was requested in.
function labelValuesEntry(
  url: string,
  name: string,
  usernameLabel: string,
  username: string
) {
  return {
    label_values: [
      { label: "URL", value: url },
      { label: "Nome", value: name },
      { label: usernameLabel, value: username },
    ],
  };
}

describe("parseWrappedRelationshipUsers - label_values username extraction", () => {
  it("extracts the username from the English 'Username' label", () => {
    const entry = labelValuesEntry(
      "https://www.instagram.com/user_01/",
      "User One",
      "Username",
      "user_01"
    );

    const users = parseWrappedRelationshipUsers(
      [entry],
      InstagramObjectArrayKeys.BLOCKED_USERS
    );

    expect(users).toEqual([
      {
        username: "user_01",
        href: "https://www.instagram.com/user_01/",
        timestamp: undefined,
      },
    ]);
  });

  it("extracts the username from the Italian 'Nome utente' label", () => {
    const entry = labelValuesEntry(
      "https://www.instagram.com/user_02/",
      "Utente Due",
      "Nome utente",
      "user_02"
    );

    const users = parseWrappedRelationshipUsers(
      [entry],
      InstagramObjectArrayKeys.BLOCKED_USERS
    );

    expect(users.map((user) => user.username)).toEqual(["user_02"]);
  });

  it("matches the label case-insensitively regardless of language", () => {
    const entry = labelValuesEntry(
      "https://www.instagram.com/user_03/",
      "Utente Tre",
      "NOME UTENTE",
      "user_03"
    );

    const users = parseWrappedRelationshipUsers(
      [entry],
      InstagramObjectArrayKeys.BLOCKED_USERS
    );

    expect(users.map((user) => user.username)).toEqual(["user_03"]);
  });

  it("regression: a real-shaped Italian label_values entry resolves for every affected category", () => {
    // Anonymized but structurally identical to the real export data that
    // surfaced this bug: blocked/restricted/closeFriends/hideStoriesFrom/
    // pendingFollowRequests/recentFollowRequests/recentlyUnfollowed all
    // route through the same parseRelationshipUserEntry.
    const categories = [
      InstagramObjectArrayKeys.BLOCKED_USERS,
      InstagramObjectArrayKeys.RESTRICTED_USERS,
      InstagramObjectArrayKeys.CLOSE_FRIENDS,
      InstagramObjectArrayKeys.HIDE_STORIES_FROM,
      InstagramObjectArrayKeys.PERMANENT_FOLLOW_REQUESTS,
      InstagramObjectArrayKeys.UNFOLLOWED_USERS,
    ];

    for (const category of categories) {
      const entry = labelValuesEntry(
        "https://www.instagram.com/giulia_rossi/",
        "Giulia Rossi",
        "Nome utente",
        "giulia_rossi"
      );

      const users = parseWrappedRelationshipUsers([entry], category);

      expect(users.map((user) => user.username)).toEqual(["giulia_rossi"]);
    }
  });

  it("falls back to the third label_values entry by position when no known label matches", () => {
    // A language not yet in USERNAME_LABELS, same real three-entry shape.
    const entry = labelValuesEntry(
      "https://www.instagram.com/user_04/",
      "Utilisateur Quatre",
      "Nom d'utilisateur",
      "user_04"
    );

    const users = parseWrappedRelationshipUsers(
      [entry],
      InstagramObjectArrayKeys.BLOCKED_USERS
    );

    expect(users.map((user) => user.username)).toEqual(["user_04"]);
  });

  it("returns nothing when no label matches and the shape isn't the expected three entries", () => {
    const entry = {
      label_values: [{ label: "Unknown field", value: "user_05" }],
    };

    const users = parseWrappedRelationshipUsers(
      [entry],
      InstagramObjectArrayKeys.BLOCKED_USERS
    );

    expect(users).toEqual([]);
  });

  it("still prefers the URL label for href regardless of username label language", () => {
    const entry = labelValuesEntry(
      "https://www.instagram.com/user_06/",
      "Utente Sei",
      "Nome utente",
      "user_06"
    );

    const users = parseWrappedRelationshipUsers(
      [entry],
      InstagramObjectArrayKeys.BLOCKED_USERS
    );

    expect(users[0]?.href).toBe("https://www.instagram.com/user_06/");
  });
});
