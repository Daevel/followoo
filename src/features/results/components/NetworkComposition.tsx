import clsx from "clsx";
import type { RelationshipGroupCounts } from "@/features/relationship/constants/relationshipGroups";
import { RELATIONSHIP_GROUPS } from "@/features/relationship/constants/relationshipGroups";
import type { TabKey } from "../types/results.types";

type NetworkCompositionProps = {
  counts: RelationshipGroupCounts;
  onOpenList: (tab: TabKey) => void;
};

const group = (key: TabKey) =>
  RELATIONSHIP_GROUPS.find((item) => item.key === key);

// What the two totals are made of. Mutual is the piece both bars share,
// which is what makes the three group names self-explanatory.
export function NetworkComposition({
  counts,
  onOpenList,
}: NetworkCompositionProps) {
  const rows = [
    {
      title: "People you follow",
      parts: ["mutual", "unfollowers"] as const,
    },
    {
      title: "People who follow you",
      parts: ["mutual", "followersOnly"] as const,
    },
  ];

  return (
    <section
      aria-label="Your network"
      className="border-line-subtle bg-surface-1 shadow-elev-1 rounded-card border p-5 text-start sm:p-6"
    >
      <h2 className="text-fg-muted text-xs font-medium">Your network</h2>

      <div className="mt-4 flex flex-col gap-5">
        {rows.map((row) => {
          const total = row.parts.reduce((sum, key) => sum + counts[key], 0);

          return (
            <div key={row.title}>
              <div className="flex items-baseline justify-between gap-4 text-sm">
                <span className="text-fg">{row.title}</span>
                <span
                  data-count={total}
                  className="text-fg font-semibold tabular-nums"
                >
                  {total}
                </span>
              </div>

              <div
                data-bar
                aria-hidden="true"
                className="bg-surface-2 mt-2 flex h-2 origin-left overflow-hidden rounded-full"
              >
                {row.parts.map((key) => (
                  <span
                    key={key}
                    className={clsx("h-full", group(key)?.dotClass)}
                    style={{
                      width: total ? `${(counts[key] / total) * 100}%` : 0,
                    }}
                  />
                ))}
              </div>

              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                {row.parts.map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onOpenList(key)}
                    className="text-fg-muted hover:text-fg focus-visible:shadow-ring flex items-center gap-1.5 rounded-control text-xs transition-colors outline-none"
                  >
                    <span
                      aria-hidden="true"
                      className={clsx(
                        "size-2 rounded-full",
                        group(key)?.dotClass
                      )}
                    />
                    {group(key)?.label}
                    <span className="text-fg tabular-nums">{counts[key]}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
