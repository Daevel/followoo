import { describe, expect, it } from "vitest";
import type {
  InstagramExportData,
  InstagramUser,
} from "@/types/instagram.types";
import { analyzeInstagramExport } from "./instagramAnalysisService";

function mkUser(username: string): InstagramUser {
  return { username };
}

function buildExportData(
  overrides: Partial<InstagramExportData>
): InstagramExportData {
  return {
    followers: [],
    following: [],
    recentlyUnfollowed: [],
    pendingFollowRequests: [],
    recentFollowRequests: [],
    blocked: [],
    restricted: [],
    closeFriends: [],
    hideStoriesFrom: [],
    ...overrides,
  };
}

function usernamesOf(users: InstagramUser[]): string[] {
  return users.map((user) => user.username).sort();
}

describe("analyzeInstagramExport", () => {
  it("splits followers/following into mutual, followers-only and following-only", () => {
    const data = buildExportData({
      followers: ["user_01", "user_02", "user_03", "user_04"].map(mkUser),
      following: ["user_02", "user_03", "user_05"].map(mkUser),
      recentlyUnfollowed: ["user_06"].map(mkUser),
      blocked: ["user_07"].map(mkUser),
    });

    const result = analyzeInstagramExport(data);

    expect(usernamesOf(result.mutual)).toEqual(["user_02", "user_03"]);
    expect(usernamesOf(result.followersOnly)).toEqual(["user_01", "user_04"]);
    expect(usernamesOf(result.unfollowers)).toEqual(["user_05"]);
    expect(usernamesOf(result.recentUnfollowers)).toEqual(["user_06"]);
    expect(usernamesOf(result.blocked)).toEqual(["user_07"]);
    expect(result.sourceCounts).toEqual({ followers: 4, following: 3 });
  });

  it("handles empty followers and following lists", () => {
    const data = buildExportData({});

    const result = analyzeInstagramExport(data);

    expect(result.mutual).toEqual([]);
    expect(result.followersOnly).toEqual([]);
    expect(result.unfollowers).toEqual([]);
    expect(result.recentUnfollowers).toEqual([]);
    expect(result.blocked).toEqual([]);
    expect(result.sourceCounts).toEqual({ followers: 0, following: 0 });
  });

  it("deduplicates a username repeated with different casing or spacing within a list", () => {
    const data = buildExportData({
      followers: [mkUser("user_01"), mkUser("User_01"), mkUser(" user_01 ")],
      following: [mkUser("user_01")],
    });

    const result = analyzeInstagramExport(data);

    expect(result.sourceCounts.followers).toBe(1);
    expect(usernamesOf(result.mutual)).toEqual(["user_01"]);
  });

  it("keeps blocked independent from followers/following when a user appears in multiple lists", () => {
    const data = buildExportData({
      followers: ["user_01", "user_02"].map(mkUser),
      following: ["user_01", "user_02"].map(mkUser),
      blocked: ["user_02"].map(mkUser),
    });

    const result = analyzeInstagramExport(data);

    expect(usernamesOf(result.mutual)).toEqual(["user_01", "user_02"]);
    expect(usernamesOf(result.blocked)).toEqual(["user_02"]);
  });
});
