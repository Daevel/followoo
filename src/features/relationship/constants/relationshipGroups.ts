import { chartTheme } from "@/components/ui/charts/chartTheme";

/**
 * The three groups every follower and followed account falls into, with the
 * label and color they carry everywhere in the app: the results tabs, the
 * "Relationship breakdown" chart and the analysis loading screen. Change a
 * label here, not in the screens that show it. The order is the reading
 * order everywhere: Mutual, then the two one-way groups.
 *
 * Labels are written from the user's side and never reuse "Followers" or
 * "Following", which only ever mean the two totals. `unfollowers` is a
 * legacy key: it holds people you follow who don't follow you back, which
 * mixes people who unfollowed you with people who never followed you. A
 * single export can't tell them apart.
 */
export const RELATIONSHIP_GROUPS = [
  {
    key: "mutual",
    label: "Mutual",
    color: chartTheme.series[0],
    dotClass: "bg-data-1",
  },
  {
    key: "unfollowers",
    label: "Don't follow you back",
    color: chartTheme.series[2],
    dotClass: "bg-data-3",
  },
  {
    key: "followersOnly",
    label: "You don't follow back",
    color: chartTheme.series[1],
    dotClass: "bg-data-2",
  },
] as const;

export type RelationshipGroupKey = (typeof RELATIONSHIP_GROUPS)[number]["key"];

export type RelationshipGroupCounts = Record<RelationshipGroupKey, number>;

export function getRelationshipGroupLabel(key: RelationshipGroupKey) {
  return RELATIONSHIP_GROUPS.find((group) => group.key === key)?.label ?? key;
}
