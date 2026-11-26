import type { CSSProperties } from "react";
import { Button } from "@/components/ui/Button";
import { formatSnapshotDay } from "@/features/history/utils/formatSnapshotDate";
import type { AnalysisComparison } from "@/features/relationship/services/analysisComparisonService";

const AVATARS = 3;

// The comparison with the last analysis saved in History, right under the
// answer: who unfollowed the user since then, with no step in between.
// Only what one export can't say; the full comparison lives in History.
export function SinceLastAnalysis({
  comparison,
  onSeeWho,
}: {
  comparison: AnalysisComparison;
  onSeeWho: () => void;
}) {
  const { older, newer } = comparison;
  const unfollowed = comparison.lostFollowers;
  const newFollowers = comparison.newFollowers.count;
  const headline =
    unfollowed.count === 0
      ? "Nobody unfollowed you"
      : `${unfollowed.count} ${unfollowed.count === 1 ? "person" : "people"} unfollowed you`;
  const rateChange =
    older.followBackRate !== null && newer.followBackRate !== null
      ? { from: older.followBackRate, to: newer.followBackRate }
      : null;
  const cardStyle: CSSProperties = {
    borderColor: "color-mix(in srgb, var(--color-brand-fg) 25%, transparent)",
  };

  return (
    <section
      aria-label="Since your last analysis"
      style={cardStyle}
      className="bg-surface-1 shadow-elev-1 flex flex-col gap-4 rounded-card border p-5 text-start sm:flex-row sm:items-center sm:gap-7 sm:px-6"
    >
      <div className="min-w-0 flex-1">
        <p className="text-fg-muted flex items-center gap-2 text-xs font-medium">
          <span
            aria-hidden="true"
            className="bg-brand-fg size-2 rounded-full"
          />
          Since your last analysis · {formatSnapshotDay(older.createdAt)}
        </p>
        <p className="text-fg mt-2 text-[22px] font-semibold tracking-[-0.025em] sm:text-2xl">
          {headline}
        </p>
        <p className="text-fg-muted mt-1 text-[13px] tabular-nums">
          {newFollowers} new {newFollowers === 1 ? "follower" : "followers"}
          {rateChange &&
            ` · follow-back rate ${rateChange.from}% → ${rateChange.to}%`}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3.5">
        {unfollowed.users.length > 0 && (
          <span aria-hidden="true" className="flex">
            {unfollowed.users.slice(0, AVATARS).map((user, index) => (
              <span
                key={user.username}
                className="border-surface-1 bg-surface-2 text-fg flex size-[30px] items-center justify-center rounded-full border-2 text-xs font-semibold first:ml-0 -ml-2"
                style={{ zIndex: AVATARS - index }}
              >
                {user.username.charAt(0).toUpperCase()}
              </span>
            ))}
          </span>
        )}
        <Button icon="arrowRight" iconPosition="right" onClick={onSeeWho}>
          {unfollowed.count === 0
            ? "See the comparison"
            : "See who unfollowed you"}
        </Button>
      </div>
    </section>
  );
}
