import { describe, expect, it } from "vitest";
import {
  isBlockedFile,
  isCloseFriendsFile,
  isFollowersFile,
  isFollowingFile,
  isHideStoriesFromFile,
  isJsonFile,
  isPendingFollowRequestsFile,
  isRawInstagramUser,
  isRecentFollowRequestsFile,
  isRecentlyUnfollowedFile,
  isRestrictedFile,
} from "./instagramUtils";

describe("isJsonFile", () => {
  it("matches a .json path", () => {
    expect(
      isJsonFile("connections/followers_and_following/followers.json")
    ).toBe(true);
  });

  it("does not match a non-.json path", () => {
    expect(
      isJsonFile("connections/followers_and_following/followers.txt")
    ).toBe(false);
  });
});

describe("isFollowersFile", () => {
  it("matches followers.json", () => {
    expect(
      isFollowersFile("connections/followers_and_following/followers.json")
    ).toBe(true);
  });

  it("matches the numbered followers_<n>.json variant nested in a parent folder", () => {
    expect(
      isFollowersFile(
        "instagram-export/connections/followers_and_following/followers_1.json"
      )
    ).toBe(true);
  });

  it("does not match following.json", () => {
    expect(
      isFollowersFile("connections/followers_and_following/following.json")
    ).toBe(false);
  });
});

describe("isFollowingFile", () => {
  it("matches following.json", () => {
    expect(
      isFollowingFile("connections/followers_and_following/following.json")
    ).toBe(true);
  });

  it("does not match followers.json", () => {
    expect(
      isFollowingFile("connections/followers_and_following/followers.json")
    ).toBe(false);
  });
});

describe("isRecentlyUnfollowedFile", () => {
  it("matches the _profiles variant", () => {
    expect(
      isRecentlyUnfollowedFile(
        "connections/followers_and_following/recently_unfollowed_profiles.json"
      )
    ).toBe(true);
  });

  it("matches the _accounts variant", () => {
    expect(
      isRecentlyUnfollowedFile(
        "connections/followers_and_following/recently_unfollowed_accounts.json"
      )
    ).toBe(true);
  });

  it("does not match a path missing the required suffix", () => {
    expect(
      isRecentlyUnfollowedFile(
        "connections/followers_and_following/recently_unfollowed.json"
      )
    ).toBe(false);
  });
});

describe("isPendingFollowRequestsFile", () => {
  it("matches pending_follow_requests.json", () => {
    expect(
      isPendingFollowRequestsFile(
        "connections/followers_and_following/pending_follow_requests.json"
      )
    ).toBe(true);
  });

  it("does not match recent_follow_requests.json", () => {
    expect(
      isPendingFollowRequestsFile(
        "connections/followers_and_following/recent_follow_requests.json"
      )
    ).toBe(false);
  });
});

describe("isRecentFollowRequestsFile", () => {
  it("matches recent_follow_requests.json", () => {
    expect(
      isRecentFollowRequestsFile(
        "connections/followers_and_following/recent_follow_requests.json"
      )
    ).toBe(true);
  });

  it("does not match pending_follow_requests.json", () => {
    expect(
      isRecentFollowRequestsFile(
        "connections/followers_and_following/pending_follow_requests.json"
      )
    ).toBe(false);
  });
});

describe("isBlockedFile", () => {
  it("matches the _profiles variant", () => {
    expect(
      isBlockedFile("connections/followers_and_following/blocked_profiles.json")
    ).toBe(true);
  });

  it("matches the _accounts variant", () => {
    expect(
      isBlockedFile("connections/followers_and_following/blocked_accounts.json")
    ).toBe(true);
  });

  it("does not match a path missing the required suffix", () => {
    expect(
      isBlockedFile("connections/followers_and_following/blocked.json")
    ).toBe(false);
  });
});

describe("isCloseFriendsFile", () => {
  it("matches the _friends variant", () => {
    expect(
      isCloseFriendsFile(
        "connections/followers_and_following/close_friends.json"
      )
    ).toBe(true);
  });

  it("matches the _accounts variant", () => {
    expect(
      isCloseFriendsFile(
        "connections/followers_and_following/close_accounts.json"
      )
    ).toBe(true);
  });

  it("does not match an unrelated path", () => {
    expect(
      isCloseFriendsFile("connections/followers_and_following/followers.json")
    ).toBe(false);
  });
});

describe("isHideStoriesFromFile", () => {
  it("matches the _from variant", () => {
    expect(
      isHideStoriesFromFile(
        "connections/followers_and_following/hide_story_from.json"
      )
    ).toBe(true);
  });

  it("matches the _accounts variant", () => {
    expect(
      isHideStoriesFromFile(
        "connections/followers_and_following/hide_story_accounts.json"
      )
    ).toBe(true);
  });

  it("does not match a path missing the required suffix", () => {
    expect(
      isHideStoriesFromFile(
        "connections/followers_and_following/hide_story.json"
      )
    ).toBe(false);
  });
});

describe("isRestrictedFile", () => {
  it("matches the _profiles variant", () => {
    expect(
      isRestrictedFile(
        "connections/followers_and_following/restricted_profiles.json"
      )
    ).toBe(true);
  });

  it("matches the _accounts variant", () => {
    expect(
      isRestrictedFile(
        "connections/followers_and_following/restricted_accounts.json"
      )
    ).toBe(true);
  });

  it("does not match a path missing the required suffix", () => {
    expect(
      isRestrictedFile("connections/followers_and_following/restricted.json")
    ).toBe(false);
  });
});

describe("isRawInstagramUser", () => {
  it("accepts a minimal raw user with only value", () => {
    expect(isRawInstagramUser({ value: "user_01" })).toBe(true);
  });

  it("accepts a raw user with href and numeric timestamp", () => {
    expect(
      isRawInstagramUser({
        value: "user_01",
        href: "https://www.instagram.com/user_01/",
        timestamp: 1_700_000_000,
      })
    ).toBe(true);
  });

  it("rejects a value missing the required username field", () => {
    expect(
      isRawInstagramUser({ href: "https://www.instagram.com/user_01/" })
    ).toBe(false);
  });

  it("rejects a raw user with a non-numeric timestamp", () => {
    expect(
      isRawInstagramUser({ value: "user_01", timestamp: "not-a-number" })
    ).toBe(false);
  });

  it("rejects non-object values", () => {
    expect(isRawInstagramUser("user_01")).toBe(false);
    expect(isRawInstagramUser(null)).toBe(false);
    expect(isRawInstagramUser(["user_01"])).toBe(false);
  });
});
