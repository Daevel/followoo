import { describe, expect, it } from "vitest";
import type {
  InstagramAnalysisResult,
  InstagramUser,
} from "@/types/instagram.types";
import {
  addPersonasToUsers,
  classifyUserPersona,
  groupUsersByPersona,
} from "./userPersonaService";

function mkUser(username: string): InstagramUser {
  return { username };
}

function buildAnalysis(
  overrides: Partial<InstagramAnalysisResult>
): InstagramAnalysisResult {
  return {
    mutual: [],
    followersOnly: [],
    unfollowers: [],
    recentUnfollowers: [],
    blocked: [],
    restricted: [],
    closeFriends: [],
    hideStoriesFrom: [],
    pendingFollowRequests: [],
    recentFollowRequests: [],
    sourceCounts: { followers: 0, following: 0 },
    ...overrides,
  };
}

describe("classifyUserPersona", () => {
  it("classifies a close friend as SUPER_FAN", () => {
    const analysis = buildAnalysis({ closeFriends: [mkUser("user_01")] });

    expect(classifyUserPersona(mkUser("user_01"), analysis)).toBe("SUPER_FAN");
  });

  it("classifies a recent unfollower as FICKLE", () => {
    const analysis = buildAnalysis({
      recentUnfollowers: [mkUser("user_02")],
    });

    expect(classifyUserPersona(mkUser("user_02"), analysis)).toBe("FICKLE");
  });

  it("classifies a mutual follower as ENGAGED", () => {
    const analysis = buildAnalysis({ mutual: [mkUser("user_03")] });

    expect(classifyUserPersona(mkUser("user_03"), analysis)).toBe("ENGAGED");
  });

  it("classifies a follower who is not followed back as LURKER", () => {
    const analysis = buildAnalysis({ followersOnly: [mkUser("user_04")] });

    expect(classifyUserPersona(mkUser("user_04"), analysis)).toBe("LURKER");
  });

  it("classifies a followed account that does not follow back as DORMANT", () => {
    const analysis = buildAnalysis({ unfollowers: [mkUser("user_05")] });

    expect(classifyUserPersona(mkUser("user_05"), analysis)).toBe("DORMANT");
  });

  it("falls back to LURKER when the user is not present in any analysis bucket", () => {
    const analysis = buildAnalysis({});

    expect(classifyUserPersona(mkUser("user_06"), analysis)).toBe("LURKER");
  });

  it("prioritizes SUPER_FAN over other matching buckets for the same user", () => {
    const analysis = buildAnalysis({
      closeFriends: [mkUser("user_07")],
      mutual: [mkUser("user_07")],
    });

    expect(classifyUserPersona(mkUser("user_07"), analysis)).toBe("SUPER_FAN");
  });
});

describe("addPersonasToUsers / groupUsersByPersona", () => {
  it("attaches a persona to each user and groups counts accordingly", () => {
    const analysis = buildAnalysis({
      closeFriends: [mkUser("user_01")],
      recentUnfollowers: [mkUser("user_02")],
      mutual: [mkUser("user_03")],
      followersOnly: [mkUser("user_04")],
      unfollowers: [mkUser("user_05")],
    });

    const users = [
      mkUser("user_01"),
      mkUser("user_02"),
      mkUser("user_03"),
      mkUser("user_04"),
      mkUser("user_05"),
    ];

    const withPersonas = addPersonasToUsers(users, analysis);

    expect(withPersonas.map((user) => user.persona)).toEqual([
      "SUPER_FAN",
      "FICKLE",
      "ENGAGED",
      "LURKER",
      "DORMANT",
    ]);

    expect(groupUsersByPersona(users, analysis)).toEqual({
      SUPER_FAN: 1,
      ENGAGED: 1,
      FICKLE: 1,
      LURKER: 1,
      DORMANT: 1,
    });
  });
});
