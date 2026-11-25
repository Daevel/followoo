import { Icon } from "@/components/ui/Icon";
import type { RelationshipGroupCounts } from "@/features/relationship/constants/relationshipGroups";
import type { TabKey } from "../types/results.types";

type ImproveActionsProps = {
  counts: RelationshipGroupCounts;
  onOpenList: (tab: TabKey) => void;
};

// Two concrete ways to raise the follow-back rate, each with its exact
// number and a link to the list. Worded so it never pushes a mass unfollow.
export function ImproveActions({ counts, onOpenList }: ImproveActionsProps) {
  const actions = [
    counts.unfollowers > 0 && {
      tab: "unfollowers" as const,
      lead: `Review ${counts.unfollowers} ${counts.unfollowers === 1 ? "account" : "accounts"}`,
      rest: " that don't follow you back. Unfollow the ones you don't care about.",
    },
    counts.followersOnly > 0 && {
      tab: "followersOnly" as const,
      lead: "Follow back",
      rest: ` the people you know among the ${counts.followersOnly} who follow you.`,
    },
  ].filter((action) => action !== false);

  if (actions.length === 0) return null;

  return (
    <section aria-labelledby="improve-title" className="text-start">
      <h2 id="improve-title" className="text-fg text-sm font-semibold">
        How to improve your follow-back rate
      </h2>
      <ul className="mt-3 grid gap-3 lg:grid-cols-2">
        {actions.map((action) => (
          <li key={action.tab}>
            <button
              type="button"
              onClick={() => onOpenList(action.tab as TabKey)}
              className="border-line-subtle bg-surface-1 hover:bg-surface-2 focus-visible:shadow-ring flex h-full w-full items-center justify-between gap-4 rounded-card border px-4 py-3 text-start text-[13px] transition-colors outline-none"
            >
              <span className="text-fg-muted leading-snug">
                <strong className="text-fg font-semibold">{action.lead}</strong>
                {action.rest}
              </span>
              <span className="text-brand-fg flex shrink-0 items-center gap-1 text-[13px] font-medium">
                Open list
                <Icon
                  name="arrowRight"
                  color="current"
                  width={14}
                  height={14}
                  aria-hidden="true"
                />
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className="text-fg-muted mt-2 text-xs">
        Brands and public figures rarely follow back: keeping them is fine.
      </p>
    </section>
  );
}
