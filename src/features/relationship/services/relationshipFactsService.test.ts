import { describe, expect, it } from "vitest";
import type { InstagramAnalysisResult } from "@/types/instagram.types";
import {
  buildRelationshipFactIndex,
  getRelationshipFacts,
} from "./relationshipFactsService";

const u = (username: string) => ({ username });

const analysis = {
  mutual: [u("giulia.r")],
  followersOnly: [],
  unfollowers: [u("studio.bianchi")],
  recentUnfollowers: [u("Marco_92")],
  blocked: [],
  restricted: [u("studio.bianchi")],
  closeFriends: [u("giulia.r")],
  hideStoriesFrom: [u("giulia.r"), u("marco_92")],
  pendingFollowRequests: [],
  recentFollowRequests: [],
  sourceCounts: { followers: 0, following: 0 },
} as unknown as InstagramAnalysisResult;

const labels = (
  username: string,
  tab: Parameters<typeof getRelationshipFacts>[2]
) =>
  getRelationshipFacts(buildRelationshipFactIndex(analysis), username, tab).map(
    (fact) => fact.label
  );

describe("relationship facts", () => {
  it("collects every list an account is in", () => {
    expect(labels("giulia.r", "mutual")).toEqual([
      "Close Friend",
      "Hidden from your stories",
    ]);
  });

  it("matches usernames whatever their case", () => {
    expect(labels("marco_92", "followersOnly")).toEqual([
      "Hidden from your stories",
      "You unfollowed",
    ]);
  });

  it("leaves out the fact that defines the open list", () => {
    expect(labels("studio.bianchi", "restricted")).toEqual([]);
    expect(labels("giulia.r", "closeFriends")).toEqual([
      "Hidden from your stories",
    ]);
  });

  it("has no facts for an account in no other list", () => {
    expect(labels("someone.else", "mutual")).toEqual([]);
  });
});
