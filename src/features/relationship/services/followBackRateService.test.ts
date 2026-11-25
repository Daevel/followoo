import { describe, expect, it } from "vitest";
import type {
  InstagramAnalysisResult,
  InstagramUser,
} from "@/types/instagram.types";
import { calculateFollowBackRate } from "./followBackRateService";

const users = (count: number, prefix: string): InstagramUser[] =>
  Array.from(
    { length: count },
    (_, i) => ({ username: `${prefix}${i}` }) as InstagramUser
  );

function analysis(
  mutual: number,
  notFollowingBack: number,
  recentlyUnfollowedByUser = 0
): InstagramAnalysisResult {
  return {
    mutual: users(mutual, "m"),
    unfollowers: users(notFollowingBack, "u"),
    recentUnfollowers: users(recentlyUnfollowedByUser, "r"),
  } as unknown as InstagramAnalysisResult;
}

describe("calculateFollowBackRate", () => {
  it("is mutual over everyone you follow", () => {
    const result = calculateFollowBackRate(analysis(5, 5));

    expect(result.rate).toBe(50);
    expect(result.followingCount).toBe(10);
    expect(result.summary).toBe(
      "5 of the 10 people you follow follow you back."
    );
  });

  it.each([
    [7, 3, "balanced"],
    [4, 6, "roomToImprove"],
    [3, 7, "oneWay"],
  ] as const)("puts %i mutual of %i one-way in %s", (mutual, oneWay, level) => {
    expect(calculateFollowBackRate(analysis(mutual, oneWay)).level).toBe(level);
  });

  it("ignores the accounts the user unfollowed", () => {
    expect(calculateFollowBackRate(analysis(5, 5, 40)).rate).toBe(50);
  });

  it("reports no data when the user follows nobody", () => {
    const result = calculateFollowBackRate(analysis(0, 0));

    expect(result.level).toBe("noData");
    expect(result.rate).toBe(0);
  });
});
