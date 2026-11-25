import type { TabKey } from "@/features/results/types/results.types";
import type { InstagramAnalysisResult } from "@/types/instagram.types";

/**
 * Facts about one account that come from the other Instagram lists. They
 * replace the old personas: each one is something the export states, never
 * a guess about how someone behaves.
 */
export const RELATIONSHIP_FACTS = [
  { key: "closeFriend", label: "Close Friend", list: "closeFriends" },
  { key: "restricted", label: "Restricted", list: "restricted" },
  {
    key: "hiddenFromStories",
    label: "Hidden from your stories",
    list: "hideStoriesFrom",
  },
  { key: "youUnfollowed", label: "You unfollowed", list: "recentUnfollowers" },
  { key: "requestSent", label: "Request sent", list: "pendingFollowRequests" },
] as const satisfies readonly {
  key: string;
  label: string;
  list: TabKey;
}[];

export type RelationshipFact = (typeof RELATIONSHIP_FACTS)[number];

export type RelationshipFactIndex = Map<string, RelationshipFact[]>;

const normalize = (username: string) => username.trim().toLowerCase();

/** One pass over the fact lists, so each row is a map lookup. */
export function buildRelationshipFactIndex(
  analysis: InstagramAnalysisResult
): RelationshipFactIndex {
  const index: RelationshipFactIndex = new Map();

  for (const fact of RELATIONSHIP_FACTS) {
    for (const user of analysis[fact.list]) {
      const key = normalize(user.username);
      const facts = index.get(key) ?? [];
      if (!facts.includes(fact)) facts.push(fact);
      index.set(key, facts);
    }
  }

  return index;
}

/**
 * The facts to show next to an account in a list. The fact that defines the
 * open list is left out: everyone in "Close Friends" is a Close Friend.
 */
export function getRelationshipFacts(
  index: RelationshipFactIndex,
  username: string,
  activeTab: TabKey
): RelationshipFact[] {
  return (index.get(normalize(username)) ?? []).filter(
    (fact) => fact.list !== activeTab
  );
}
