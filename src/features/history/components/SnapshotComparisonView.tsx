import clsx from "clsx";
import { type CSSProperties, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { UserListItem } from "@/components/ui/UserListItem";
import type {
  AnalysisComparison,
  ComparisonDiff,
  RenamedAccount,
} from "@/features/relationship/services/analysisComparisonService";
import { formatDate, normalizeUsername } from "@/lib";
import { formatSnapshotDay } from "../utils/formatSnapshotDate";

const VISIBLE_USERS_LIMIT = 8;

function DiffList({
  title,
  diff,
  countClass,
  datePrefix,
  empty,
}: {
  title: string;
  diff: ComparisonDiff;
  countClass: string;
  /** What the row date means, e.g. "Followed you since". */
  datePrefix: string;
  empty: string;
}) {
  const [showAll, setShowAll] = useState(false);
  const visibleUsers = showAll
    ? diff.users
    : diff.users.slice(0, VISIBLE_USERS_LIMIT);
  const remaining = diff.users.length - visibleUsers.length;

  return (
    <section className="border-line-subtle bg-surface-1 shadow-elev-1 flex flex-col gap-2 rounded-card border p-5 text-start">
      <h3 className="text-fg flex items-center justify-between gap-3 text-sm font-semibold">
        {title}
        <span
          className={clsx("text-xs font-semibold tabular-nums", countClass)}
        >
          {diff.count}
        </span>
      </h3>

      {diff.users.length === 0 ? (
        <p className="text-fg-muted text-[13px]">{empty}</p>
      ) : (
        <>
          <ul className="flex flex-col">
            {visibleUsers.map((user) => (
              <li key={user.username}>
                <UserListItem
                  user={user}
                  formatDate={formatDate}
                  datePrefix={datePrefix}
                  appearance="row"
                />
              </li>
            ))}
          </ul>
          {remaining > 0 && (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="text-brand-fg focus-visible:shadow-ring self-start rounded-control text-[13px] font-medium outline-none hover:underline"
            >
              Show {remaining} more
            </button>
          )}
        </>
      )}
    </section>
  );
}

// Renamed accounts, once each even when they are both a follower and
// followed: listed under the new name (its profile link works) with the
// old one underneath. They count neither as lost nor as new.
function RenamedList({ renamed }: { renamed: RenamedAccount[] }) {
  return (
    <section className="border-line-subtle bg-surface-1 shadow-elev-1 flex flex-col gap-2 rounded-card border p-5 text-start">
      <h3 className="text-fg flex items-center justify-between gap-3 text-sm font-semibold">
        Changed username
        <span className="text-fg-muted text-xs font-semibold tabular-nums">
          {renamed.length}
        </span>
      </h3>
      <p className="text-fg-muted text-[13px] leading-snug">
        Same account, new name: they didn&apos;t unfollow you.
      </p>
      <ul className="flex flex-col">
        {renamed.map(({ from, to }) => (
          <li key={`${from.username}-${to.username}`}>
            <UserListItem
              user={to}
              formatDate={() => `Previously @${from.username}`}
              appearance="row"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

function uniqueRenamed(comparison: AnalysisComparison): RenamedAccount[] {
  const seen = new Set<string>();
  return [
    ...comparison.renamedFollowers,
    ...comparison.renamedFollowing,
  ].filter((pair) => {
    const key = normalizeUsername(pair.to.username);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

type Trend = "up" | "down" | "neutral";

function Delta({
  label,
  from,
  to,
  change,
  trend,
}: {
  label: string;
  from: string;
  to: string;
  change: string;
  trend: Trend;
}) {
  return (
    <div className="border-line-subtle bg-surface-0 min-w-0 rounded-control border px-4 py-3.5">
      <p className="text-fg-muted text-xs leading-snug">{label}</p>
      <p className="text-fg mt-1 text-xl font-semibold tracking-[-0.02em] tabular-nums">
        {to}
      </p>
      <p className="text-fg-faint mt-0.5 text-xs tabular-nums">
        from {from} ·{" "}
        <span
          className={clsx(
            "font-semibold",
            trend === "up" && "text-success",
            trend === "down" && "text-danger",
            trend === "neutral" && "text-fg-muted"
          )}
        >
          {change}
        </span>
      </p>
    </div>
  );
}

function signed(value: number, unit = "") {
  if (value === 0) return `0${unit}`;
  // A real minus sign, so "−5" lines up with "+12".
  return `${value > 0 ? "+" : "−"}${Math.abs(value)}${unit}`;
}

/** Up is good unless `lowerIsBetter`; no change is neutral. */
function trendOf(change: number, lowerIsBetter = false): Trend {
  if (change === 0) return "neutral";
  return change > 0 !== lowerIsBetter ? "up" : "down";
}

type SnapshotComparisonViewProps = {
  comparison: AnalysisComparison;
  onBack: () => void;
};

// Answer first, like the results page: how many people unfollowed you
// between the two analyses, then what changed in the totals, then who.
// Your own follows and unfollows sit in a collapsed row: they explain
// part of the totals but aren't the question people come with.
export function SnapshotComparisonView({
  comparison,
  onBack,
}: SnapshotComparisonViewProps) {
  const [showOwnChanges, setShowOwnChanges] = useState(false);
  const { older, newer } = comparison;
  const unfollowedYou = comparison.lostFollowers.count;
  const renamed = uniqueRenamed(comparison);

  const followers = newer.followersCount - older.followersCount;
  const following = newer.followingCount - older.followingCount;
  const notBack = newer.notFollowingBackCount - older.notFollowingBackCount;
  const rateChange =
    older.followBackRate !== null && newer.followBackRate !== null
      ? newer.followBackRate - older.followBackRate
      : null;

  const heroStyle: CSSProperties = {
    background: [
      "radial-gradient(560px 240px at 10% 0%, color-mix(in srgb, var(--color-brand-fg) 14%, transparent), transparent 70%)",
      "var(--color-surface-1)",
    ].join(", "),
  };

  return (
    <div className="flex flex-col gap-5" data-page-animate="item">
      <Button
        variant="ghost"
        size="sm"
        icon="arrowLeft"
        onClick={onBack}
        className="-ml-3 self-start"
      >
        Back to history
      </Button>

      <section
        aria-label="Who unfollowed you"
        style={heroStyle}
        className="border-line-subtle shadow-elev-1 rounded-card border p-5 text-start sm:p-7"
      >
        <p className="text-fg-muted text-xs font-medium tabular-nums">
          {formatSnapshotDay(older.createdAt)} →{" "}
          {formatSnapshotDay(newer.createdAt)}
        </p>
        <p className="text-fg mt-2.5 text-[52px] leading-none font-semibold tracking-[-0.04em] tabular-nums sm:text-[64px]">
          {unfollowedYou}
        </p>
        <p className="text-fg-muted mt-2 text-base sm:text-[17px]">
          <strong className="text-fg font-semibold">
            {unfollowedYou === 1
              ? "person unfollowed you"
              : "people unfollowed you"}
          </strong>{" "}
          between these two analyses.
        </p>
        <p className="text-fg-faint mt-2.5 max-w-xl text-xs leading-relaxed">
          Also counted here: accounts that were deactivated or blocked you,
          which Instagram&apos;s export can&apos;t tell apart. Accounts that
          only changed username are recognized and listed separately.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
          <Delta
            label="Followers"
            from={String(older.followersCount)}
            to={String(newer.followersCount)}
            change={signed(followers)}
            trend={trendOf(followers)}
          />
          <Delta
            label="Following"
            from={String(older.followingCount)}
            to={String(newer.followingCount)}
            change={signed(following)}
            trend="neutral"
          />
          <Delta
            label="Follow-back rate"
            from={
              older.followBackRate === null ? "–" : `${older.followBackRate}%`
            }
            to={
              newer.followBackRate === null ? "–" : `${newer.followBackRate}%`
            }
            change={rateChange === null ? "–" : signed(rateChange, " pts")}
            trend={rateChange === null ? "neutral" : trendOf(rateChange)}
          />
          <Delta
            label="Don't follow you back"
            from={String(older.notFollowingBackCount)}
            to={String(newer.notFollowingBackCount)}
            change={signed(notBack)}
            trend={trendOf(notBack, true)}
          />
        </div>
      </section>

      {comparison.dataOrderMismatch && (
        <Callout title="Check which export is which" variant="info">
          The export saved more recently contains older data than the other one.
          The comparison follows the order they were saved in.
        </Callout>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <DiffList
          title="Unfollowed you"
          diff={comparison.lostFollowers}
          countClass="text-danger"
          datePrefix="Followed you since"
          empty="Nobody unfollowed you between these two analyses."
        />
        <DiffList
          title="New followers"
          diff={comparison.newFollowers}
          countClass="text-success"
          datePrefix="Followed you on"
          empty="No new followers between these two analyses."
        />
      </div>

      {renamed.length > 0 && <RenamedList renamed={renamed} />}

      <section className="border-line-subtle bg-surface-1 shadow-elev-1 rounded-card border text-start">
        <button
          type="button"
          aria-expanded={showOwnChanges}
          onClick={() => setShowOwnChanges((previous) => !previous)}
          className="focus-visible:shadow-ring flex w-full items-center justify-between gap-4 rounded-card px-5 py-4 text-start outline-none"
        >
          <span>
            <span className="text-fg block text-sm font-semibold">
              Your own changes
            </span>
            <span className="text-fg-muted text-[13px]">
              You followed {comparison.newFollowing.count} and unfollowed{" "}
              {comparison.lostFollowing.count}.
            </span>
          </span>
          <span className="text-brand-fg shrink-0 text-[13px] font-medium">
            {showOwnChanges ? "Hide" : "Show"}
          </span>
        </button>

        {showOwnChanges && (
          <div className="grid gap-4 px-5 pb-5 md:grid-cols-2">
            <DiffList
              title="You followed"
              diff={comparison.newFollowing}
              countClass="text-fg-muted"
              datePrefix="Followed on"
              empty="You didn't follow anyone new."
            />
            <DiffList
              title="You unfollowed"
              diff={comparison.lostFollowing}
              countClass="text-fg-muted"
              datePrefix="Following since"
              empty="You didn't unfollow anyone."
            />
          </div>
        )}
      </section>
    </div>
  );
}
