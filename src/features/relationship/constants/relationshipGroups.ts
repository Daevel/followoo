import { chartTheme } from "@/components/ui/charts/chartTheme";

/**
 * The three groups every follower and followed account falls into, with the
 * label and color they carry everywhere in the app: the results tabs, the
 * "Relationship breakdown" chart and the analysis loading screen. Change a
 * label here, not in the screens that show it.
 */
export const RELATIONSHIP_GROUPS = [
  {
    key: "mutual",
    label: "Mutual",
    color: chartTheme.series[0],
    dotClass: "bg-data-1",
  },
  {
    key: "followersOnly",
    label: "Follower",
    color: chartTheme.series[1],
    dotClass: "bg-data-2",
  },
  {
    key: "unfollowers",
    label: "Following",
    color: chartTheme.series[2],
    dotClass: "bg-data-3",
  },
] as const;

export type RelationshipGroupKey = (typeof RELATIONSHIP_GROUPS)[number]["key"];

export type RelationshipGroupCounts = Record<RelationshipGroupKey, number>;

export function getRelationshipGroupLabel(key: RelationshipGroupKey) {
  return RELATIONSHIP_GROUPS.find((group) => group.key === key)?.label ?? key;
}
