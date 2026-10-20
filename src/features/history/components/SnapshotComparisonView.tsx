import { useState } from "react";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SnapshotComparisonChart } from "@/components/ui/charts/SnapshotComparisonChart";
import { Icon } from "@/components/ui/Icon";
import { UserListItem } from "@/components/ui/UserListItem";
import type {
  AnalysisComparison,
  ComparisonDiff,
  SnapshotPeriodSummary,
} from "@/features/relationship/services/analysisComparisonService";
import { formatDate } from "@/lib";
import { formatSnapshotDate } from "../utils/formatSnapshotDate";

const VISIBLE_USERS_LIMIT = 8;

function ComparisonCategoryList({
  title,
  diff,
  tone,
}: {
  title: string;
  diff: ComparisonDiff;
  tone: BadgeTone;
}) {
  const [showAll, setShowAll] = useState(false);
  const visibleUsers = showAll
    ? diff.users
    : diff.users.slice(0, VISIBLE_USERS_LIMIT);
  const remaining = diff.users.length - visibleUsers.length;

  return (
    <div className="border-line-subtle bg-surface-1 shadow-elev-1 flex flex-col gap-3 rounded-card border p-5 text-start">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-fg text-sm font-semibold">{title}</h3>
        <Badge tone={tone}>{diff.count}</Badge>
      </div>

      {diff.users.length === 0 ? (
        <p className="text-fg-muted text-[13px]">No changes here.</p>
      ) : (
        <>
          <ul className="flex flex-col gap-1.5">
            {visibleUsers.map((user) => (
              <li key={user.username}>
                <UserListItem
                  user={user}
                  formatDate={formatDate}
                  appearance="row"
                />
              </li>
            ))}
          </ul>
          {remaining > 0 && (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="text-fg-muted hover:text-fg self-start text-[13px] font-medium underline-offset-2 hover:underline"
            >
              Show {remaining} more
            </button>
          )}
        </>
      )}
    </div>
  );
}

// The data date decides which side is "before", so it leads; the save
// date is secondary. Old exports without timestamps fall back to it.
function periodLabel(summary: SnapshotPeriodSummary) {
  const dataUntil = formatDate(summary.dataUntil ?? undefined);
  return dataUntil
    ? `Data up to ${dataUntil}`
    : formatSnapshotDate(summary.createdAt);
}

function PeriodSide({
  side,
  summary,
}: {
  side: "Before" | "After";
  summary: SnapshotPeriodSummary;
}) {
  return (
    <div className="min-w-0">
      <p className="text-fg-muted text-xs font-medium">{side}</p>
      <p className="text-fg mt-0.5 text-sm font-semibold sm:text-base">
        {periodLabel(summary)}
      </p>
      {summary.dataUntil !== null && (
        <p className="text-fg-faint mt-0.5 text-xs">
          Saved {formatSnapshotDate(summary.createdAt)}
        </p>
      )}
    </div>
  );
}

type SnapshotComparisonViewProps = {
  comparison: AnalysisComparison;
  onBack: () => void;
};

export function SnapshotComparisonView({
  comparison,
  onBack,
}: SnapshotComparisonViewProps) {
  const [showFollowing, setShowFollowing] = useState(false);
  const chartData = [
    {
      category: "Followers",
      older: comparison.older.followersCount,
      newer: comparison.newer.followersCount,
    },
    {
      category: "Following",
      older: comparison.older.followingCount,
      newer: comparison.newer.followingCount,
    },
    {
      category: "Mutuals",
      older: comparison.older.mutualsCount,
      newer: comparison.newer.mutualsCount,
    },
  ];

  const olderLabel = periodLabel(comparison.older);
  const newerLabel = periodLabel(comparison.newer);

  return (
    <div className="flex flex-col gap-6" data-page-animate="item">
      <div className="border-line-subtle bg-surface-1 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 rounded-card border p-4 text-start sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto] sm:gap-4">
        <PeriodSide side="Before" summary={comparison.older} />
        <span
          aria-hidden="true"
          className="border-line-strong bg-surface-2 text-fg-muted flex size-8 items-center justify-center rounded-full border"
        >
          <Icon
            name="arrowRight"
            color="current"
            width={14}
            height={14}
            aria-hidden="true"
          />
        </span>
        <PeriodSide side="After" summary={comparison.newer} />
        <Button
          variant="ghost"
          size="sm"
          icon="arrowLeft"
          onClick={onBack}
          className="col-span-3 justify-self-start sm:col-span-1 sm:justify-self-end"
        >
          Back to history
        </Button>
      </div>

      <SnapshotComparisonChart
        data={chartData}
        olderLabel={olderLabel}
        newerLabel={newerLabel}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <ComparisonCategoryList
          title="New followers"
          diff={comparison.newFollowers}
          tone="success"
        />
        <ComparisonCategoryList
          title="Followers lost"
          diff={comparison.lostFollowers}
          tone="danger"
        />
        <ComparisonCategoryList
          title="New mutuals"
          diff={comparison.newMutuals}
          tone="success"
        />
        <ComparisonCategoryList
          title="Mutuals lost"
          diff={comparison.lostMutuals}
          tone="danger"
        />
      </div>

      <div>
        <button
          type="button"
          onClick={() => setShowFollowing((previous) => !previous)}
          className="text-fg-muted hover:text-fg text-sm font-medium underline-offset-2 hover:underline"
        >
          {showFollowing ? "Hide" : "Show"} following changes
        </button>

        {showFollowing && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <ComparisonCategoryList
              title="New following"
              diff={comparison.newFollowing}
              tone="neutral"
            />
            <ComparisonCategoryList
              title="Unfollowed"
              diff={comparison.lostFollowing}
              tone="neutral"
            />
          </div>
        )}
      </div>
    </div>
  );
}
