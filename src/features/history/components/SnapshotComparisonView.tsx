import { useState } from "react";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SnapshotComparisonChart } from "@/components/ui/charts/SnapshotComparisonChart";
import { UserListItem } from "@/components/ui/UserListItem";
import type {
  AnalysisComparison,
  ComparisonDiff,
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

  const olderLabel = formatSnapshotDate(comparison.older.createdAt);
  const newerLabel = formatSnapshotDate(comparison.newer.createdAt);

  return (
    <div className="flex flex-col gap-6" data-page-animate="item">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-fg-muted text-sm">
          Comparing <span className="text-fg font-medium">{olderLabel}</span> to{" "}
          <span className="text-fg font-medium">{newerLabel}</span>
        </p>
        <Button variant="ghost" size="sm" icon="arrowLeft" onClick={onBack}>
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
