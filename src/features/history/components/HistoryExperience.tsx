import { SignInButton, useAuth } from "@clerk/react";
import clsx from "clsx";
import {
  lazy,
  type ReactNode,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link, useSearchParams } from "react-router";
import { useFeatureFlag } from "@/analytics";
import { useStandardPageAnimation } from "@/animations/pages/useStandardPageAnimation";
import { Badge } from "@/components/ui/Badge";
import { Button, buttonClasses } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Checkbox } from "@/components/ui/Checkbox";
import { Container } from "@/components/ui/Container";
import { FabIcon } from "@/components/ui/FabIcon";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Mascot } from "@/components/ui/Mascot";
import { Modal } from "@/components/ui/Modal";
import { NavBar } from "@/components/ui/NavBar";
import { PageHeader } from "@/components/ui/PageHeader";
import Seo from "@/components/ui/Seo";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { Skeleton } from "@/components/ui/Skeleton";
import type { AnalysisComparison } from "@/features/relationship/services/analysisComparisonService";
import { ResultsExperience } from "@/features/results/components/ResultsExperience";
import { SYNC_FEATURE_FLAG_KEY } from "@/features/sync/constants";
import { useSyncKey } from "@/providers/SyncKeyProvider";
import type { InstagramAnalysisResult } from "@/types/instagram.types";
import { useHistorySnapshots } from "../hooks/useHistorySnapshots";
import { useOpenSnapshot } from "../hooks/useOpenSnapshot";
import { useSnapshotComparison } from "../hooks/useSnapshotComparison";
import type { SnapshotListItem } from "../services/historyService";
import {
  formatSnapshotDate,
  formatSnapshotDay,
} from "../utils/formatSnapshotDate";
import { SnapshotComparisonView } from "./SnapshotComparisonView";

function LatestChange({
  comparison,
  onOpen,
}: {
  comparison: AnalysisComparison;
  onOpen: () => void;
}) {
  const { older, newer } = comparison;
  const unfollowedYou = comparison.lostFollowers.count;
  const headline =
    unfollowedYou === 0
      ? "Nobody unfollowed you"
      : `${unfollowedYou} ${unfollowedYou === 1 ? "person" : "people"} unfollowed you`;
  const rate =
    older.followBackRate !== null && newer.followBackRate !== null
      ? ` · follow-back rate ${older.followBackRate}% → ${newer.followBackRate}%`
      : "";

  return (
    <section aria-labelledby="latest-change-title" className="text-start">
      <div className="mb-2.5 flex items-baseline justify-between gap-3">
        <h2
          id="latest-change-title"
          className="text-fg text-base font-semibold"
        >
          Latest change
        </h2>
        <p className="text-fg-faint hidden text-xs sm:block">
          Your last two analyses, compared automatically
        </p>
      </div>
      <div className="border-line-subtle bg-surface-1 shadow-elev-1 flex flex-col gap-4 rounded-card border p-5 sm:flex-row sm:items-center sm:gap-6 sm:px-6">
        <div className="min-w-0 flex-1">
          <p className="text-fg-muted text-xs font-medium tabular-nums">
            {formatSnapshotDay(older.createdAt)} →{" "}
            {formatSnapshotDay(newer.createdAt)}
          </p>
          <p className="text-fg mt-2 text-[22px] font-semibold tracking-[-0.025em] sm:text-[26px]">
            {headline}
          </p>
          <p className="text-fg-muted mt-1 text-[13px] tabular-nums">
            {comparison.newFollowers.count} new{" "}
            {comparison.newFollowers.count === 1 ? "follower" : "followers"} ·
            following {older.followingCount} → {newer.followingCount}
            {rate}
          </p>
        </div>
        <Button icon="arrowRight" iconPosition="right" onClick={onOpen}>
          Open comparison
        </Button>
      </div>
    </section>
  );
}

// Only mounted once encrypted history is unlocked - its own data fetch
// (useHistorySnapshots) has no reason to run otherwise. The list arrives
// newest first; the two newest entries are compared on their own, and
// picking two other dates is the secondary path.
function HistoryList({
  masterKey,
  onOpen,
  onCompared,
  openLatest,
}: {
  masterKey: Uint8Array<ArrayBuffer>;
  onOpen: (analysis: InstagramAnalysisResult) => void;
  onCompared: (comparison: AnalysisComparison) => void;
  /** Open the latest comparison as soon as it's ready (from the results). */
  openLatest: { current: boolean };
}) {
  const { items, status, removeSnapshot } = useHistorySnapshots();
  const { openSnapshot, status: openStatus } = useOpenSnapshot();
  const { status: comparisonStatus, compare } = useSnapshotComparison();
  const { compare: compareLatest } = useSnapshotComparison();
  const [latest, setLatest] = useState<AnalysisComparison | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SnapshotListItem | null>(
    null
  );
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const isComparing = comparisonStatus === "loading";
  const newestId = items[0]?.id;
  const previousId = items[1]?.id;

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-run only when the two newest entries change, not on every new items array
  useEffect(() => {
    const [newest, previous] = items;
    setLatest(null);
    if (!newest || !previous) return;

    let isCurrent = true;
    void compareLatest(previous, newest, masterKey).then((comparison) => {
      if (isCurrent) setLatest(comparison);
    });
    return () => {
      isCurrent = false;
    };
  }, [newestId, previousId, masterKey, compareLatest]);

  // Coming from "See who unfollowed you" on the results page.
  useEffect(() => {
    if (latest && openLatest.current) {
      openLatest.current = false;
      onCompared(latest);
    }
  }, [latest, openLatest, onCompared]);

  function toggleSelected(id: string) {
    setSelectedIds((previous) => {
      if (previous.includes(id)) {
        return previous.filter((selectedId) => selectedId !== id);
      }
      if (previous.length >= 2) return previous;
      return [...previous, id];
    });
  }

  function stopSelecting() {
    setIsSelecting(false);
    setSelectedIds([]);
  }

  async function handleOpen(id: string) {
    setPendingId(id);
    const analysis = await openSnapshot(id, masterKey);
    setPendingId(null);

    if (analysis) {
      onOpen(analysis);
    }
  }

  async function handleDelete(item: SnapshotListItem) {
    setDeleteTarget(null);
    setPendingId(item.id);
    await removeSnapshot(item.id);
    setPendingId(null);
    setSelectedIds((previous) =>
      previous.filter((selectedId) => selectedId !== item.id)
    );
  }

  async function handleCompare() {
    if (selectedIds.length !== 2) return;

    const [itemA, itemB] = selectedIds.map((id) =>
      items.find((item) => item.id === id)
    );

    if (!itemA || !itemB) return;

    const comparison = await compare(itemA, itemB, masterKey);

    if (comparison) {
      stopSelecting();
      onCompared(comparison);
    }
  }

  if (status === "loading") {
    return (
      <Skeleton
        variant="list"
        items={4}
        lines={1}
        shape="rectangle"
        animation="wave"
        size="md"
        ariaLabel="Loading your history"
      />
    );
  }

  if (items.length === 0) {
    return (
      <div className="border-line-subtle bg-surface-1 shadow-elev-1 flex flex-col items-center rounded-card border px-6 py-11 text-center">
        <Mascot pose="sleep" size={96} />
        <h2 className="text-fg mt-3.5 text-lg font-semibold tracking-[-0.015em]">
          Nothing saved yet
        </h2>
        <p className="text-fg-muted mt-2 max-w-md text-sm leading-[1.55]">
          Analyze your export while signed in and it&apos;s saved here,
          encrypted. From the second one on, Followoo shows who unfollowed you
          automatically.
        </p>
        <Link
          to="/get-started"
          className={clsx(
            buttonClasses({ variant: "primary", size: "md" }),
            "mt-6"
          )}
        >
          Analyze your export
          <Icon
            name="arrowRight"
            color="current"
            width={16}
            height={16}
            aria-hidden="true"
          />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-7">
      {items.length === 1 ? (
        <Callout title="Your first analysis is saved" variant="info">
          From your next analysis, Followoo compares it with this one and shows
          who unfollowed you. Nothing extra to do.
        </Callout>
      ) : latest ? (
        <LatestChange comparison={latest} onOpen={() => onCompared(latest)} />
      ) : (
        <Skeleton
          variant="list"
          items={1}
          lines={2}
          shape="rectangle"
          animation="wave"
          size="lg"
          ariaLabel="Comparing your last two analyses"
        />
      )}

      <section aria-labelledby="saved-title" className="text-start">
        <div className="mb-1 flex min-h-9 items-center justify-between gap-3">
          <h2 id="saved-title" className="text-fg text-base font-semibold">
            {isSelecting ? "Pick two analyses" : "Saved analyses"}{" "}
            <span className="text-fg-faint font-medium tabular-nums">
              {isSelecting ? `${selectedIds.length} of 2` : items.length}
            </span>
          </h2>
          {isSelecting ? (
            <span className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={stopSelecting}>
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={selectedIds.length !== 2}
                loading={isComparing}
                onClick={handleCompare}
              >
                Compare
              </Button>
            </span>
          ) : (
            items.length >= 3 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-brand-fg"
                onClick={() => setIsSelecting(true)}
              >
                Compare other dates
              </Button>
            )
          )}
        </div>

        <ul className="flex flex-col">
          {items.map((item, index) => {
            const isPending = pendingId === item.id && openStatus === "loading";
            const isDeleting = pendingId === item.id;
            const isSelected = selectedIds.includes(item.id);
            const date = formatSnapshotDate(item.createdAt);

            return (
              <li
                key={item.id}
                className="border-line-subtle flex items-center gap-3 border-t py-3.5"
              >
                {isSelecting && (
                  <Checkbox
                    checked={isSelected}
                    disabled={
                      isComparing || (!isSelected && selectedIds.length >= 2)
                    }
                    onChange={() => toggleSelected(item.id)}
                    aria-label={`Select ${date} for comparison`}
                  />
                )}
                <span className="text-fg flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium">
                  {date}
                  {index === 0 && (
                    <Badge tone="brand" size="sm">
                      Latest
                    </Badge>
                  )}
                </span>
                <Button
                  size="sm"
                  variant="secondary"
                  loading={isPending}
                  disabled={isDeleting}
                  onClick={() => handleOpen(item.id)}
                >
                  View
                </Button>
                <FabIcon
                  size="sm"
                  variant="ghost"
                  icon="trash"
                  disabled={isPending || isDeleting}
                  onClick={() => setDeleteTarget(item)}
                  aria-label={`Delete the analysis saved ${date}`}
                />
              </li>
            );
          })}
        </ul>
      </section>

      {deleteTarget && (
        <Modal
          labelledBy="delete-snapshot-title"
          onClose={() => setDeleteTarget(null)}
        >
          <h2
            id="delete-snapshot-title"
            className="text-fg pr-8 text-lg font-semibold tracking-[-0.015em]"
          >
            Delete this analysis?
          </h2>
          <p className="text-fg-muted mt-2 text-sm leading-[1.55]">
            The analysis saved on {formatSnapshotDate(deleteTarget.createdAt)}{" "}
            will be removed from your history for good. Your other analyses
            stay.
          </p>
          <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => handleDelete(deleteTarget)}>
              Delete
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// Lazy: both wizards pull in react-hook-form, zod and the sync crypto
// module, which nothing else on this page needs until a dialog opens.
const SyncActivationWizard = lazy(() =>
  import("@/features/sync/components/SyncActivationWizard").then((module) => ({
    default: module.SyncActivationWizard,
  }))
);
const SyncUnlockWizard = lazy(() =>
  import("@/features/sync/components/SyncUnlockWizard").then((module) => ({
    default: module.SyncUnlockWizard,
  }))
);

// Centered card for every state where the list can't be shown yet.
function HistoryGate({
  icon,
  title,
  children,
  action,
}: {
  icon: IconName;
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="border-line-subtle bg-surface-1 shadow-elev-1 flex flex-col items-center rounded-card border px-6 py-12 text-center">
      <span className="border-brand-fg/20 bg-brand-fg/10 text-brand-fg flex size-10 items-center justify-center rounded-control border">
        <Icon
          name={icon}
          color="current"
          width={18}
          height={18}
          aria-hidden="true"
        />
      </span>
      <h2 className="text-fg mt-4 text-lg font-semibold tracking-[-0.015em]">
        {title}
      </h2>
      <p className="text-fg-muted mt-2 max-w-md text-sm leading-[1.55]">
        {children}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function HistoryExperience() {
  const { isLoaded, isSignedIn } = useAuth();
  const isSyncEnabled = useFeatureFlag(SYNC_FEATURE_FLAG_KEY, false);
  const { status, masterKey } = useSyncKey();
  const [openedAnalysis, setOpenedAnalysis] =
    useState<InstagramAnalysisResult | null>(null);
  const [comparisonResult, setComparisonResult] =
    useState<AnalysisComparison | null>(null);
  const [dialog, setDialog] = useState<"unlock" | "activate" | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const view = searchParams.get("view");
  const hasPromptedUnlock = useRef(false);

  // Unlocking is part of opening History, not a separate step: the first
  // time the page finds the history locked, the unlock dialog opens on its
  // own. "Not now" leaves the page locked with a button to reopen it.
  useEffect(() => {
    if (status === "locked" && !hasPromptedUnlock.current) {
      hasPromptedUnlock.current = true;
      setDialog("unlock");
    }
  }, [status]);

  const rootRef = useRef<HTMLDivElement | null>(null);
  useStandardPageAnimation(rootRef, {
    animateItems: status === "unlocked" && !comparisonResult,
  });

  // An opened analysis or comparison is a step in the browser history
  // (?view=analysis|comparison), so Back returns to the list. The data
  // itself only lives in memory. React Router updates the URL a moment
  // after the state, so only the change from a view back to none closes
  // it; a view in the URL with nothing in memory (after a reload) is
  // dropped once, on mount.
  const previousView = useRef(view);
  useEffect(() => {
    const previous = previousView.current;
    previousView.current = view;
    if (previous !== null && view === null) {
      setOpenedAnalysis(null);
      setComparisonResult(null);
    }
  }, [view]);

  // "See who unfollowed you" on the results page lands on ?open=latest.
  const openLatest = useRef(searchParams.get("open") === "latest");

  // biome-ignore lint/correctness/useExhaustiveDependencies: on mount only
  useEffect(() => {
    if (view !== null || searchParams.has("open")) {
      setSearchParams({}, { replace: true });
    }
  }, []);

  function openAnalysis(analysis: InstagramAnalysisResult) {
    setOpenedAnalysis(analysis);
    setSearchParams({ view: "analysis" });
    window.scrollTo({ top: 0 });
  }

  function openComparison(comparison: AnalysisComparison) {
    setComparisonResult(comparison);
    setSearchParams({ view: "comparison" });
    window.scrollTo({ top: 0 });
  }

  function backToList() {
    // Same as the browser's Back, so the two never disagree.
    window.history.back();
  }

  // Reusing ResultsExperience as-is (its NavBar carries the History link)
  // instead of building a second results UI from scratch.
  if (openedAnalysis) {
    return <ResultsExperience analysis={openedAnalysis} onBack={backToList} />;
  }

  function renderContent() {
    if (!isLoaded) return <HistorySkeleton label="Loading your account" />;

    if (!isSignedIn) {
      return (
        <HistoryGate
          icon="lock"
          title="Sign in to see your history"
          action={
            <SignInButton mode="modal">
              <Button>Sign in</Button>
            </SignInButton>
          }
        >
          Your saved analyses are tied to your Followoo account and encrypted in
          your browser.
        </HistoryGate>
      );
    }

    if (!isSyncEnabled) {
      return (
        <Callout title="Not available" variant="info">
          Encrypted history isn't available for your account right now.
        </Callout>
      );
    }

    if (status === "checking") {
      return <HistorySkeleton label="Checking encrypted history status" />;
    }

    if (status === "unavailable") {
      return (
        <Callout title="Something went wrong" variant="danger">
          We couldn't check your encrypted history status. Please try again
          later.
        </Callout>
      );
    }

    if (status === "inactive") {
      return (
        <HistoryGate
          icon="shield"
          title="Keep a private history"
          action={
            <Button onClick={() => setDialog("activate")}>
              Turn on encrypted history
            </Button>
          }
        >
          Save every analysis, encrypted in your browser, and compare how your
          network changes over time. Free with your account.
        </HistoryGate>
      );
    }

    if (status === "locked") {
      return (
        <HistoryGate
          icon="lock"
          title="Your history is locked"
          action={
            <Button
              icon="arrowRight"
              iconPosition="right"
              onClick={() => setDialog("unlock")}
            >
              Unlock
            </Button>
          }
        >
          Enter your passphrase to read your saved analyses on this device.
        </HistoryGate>
      );
    }

    if (!masterKey) return null;

    return comparisonResult ? (
      <SnapshotComparisonView
        comparison={comparisonResult}
        onBack={backToList}
      />
    ) : (
      <HistoryList
        masterKey={masterKey}
        onOpen={openAnalysis}
        onCompared={openComparison}
        openLatest={openLatest}
      />
    );
  }

  return (
    <>
      <Seo
        title="Your encrypted history - Followoo"
        description="Review your past Instagram export analyses, encrypted end-to-end."
        image="https://followoo.app/icons/OG.png"
        canonical="https://followoo.app/history"
      />
      <section className="flex min-h-svh flex-col">
        <NavBar />

        <Container size="app" className="flex flex-1 flex-col">
          <div ref={rootRef} className="flex-1 pb-20">
            <PageHeader
              kicker="Encrypted history"
              title="Your saved analyses"
              wide
              description="Every entry is encrypted in your browser before it reaches our servers - only the date is ever stored in the clear."
            />

            <div data-page-animate="content" className="flex w-full flex-col">
              {renderContent()}
            </div>
          </div>
        </Container>
        <SiteFooter />
      </section>

      {dialog && (
        <Suspense fallback={null}>
          {dialog === "unlock" ? (
            <SyncUnlockWizard onClose={() => setDialog(null)} />
          ) : (
            <SyncActivationWizard onClose={() => setDialog(null)} />
          )}
        </Suspense>
      )}
    </>
  );
}

function HistorySkeleton({ label }: { label: string }) {
  return (
    <Skeleton
      variant="list"
      items={3}
      lines={1}
      shape="rectangle"
      animation="wave"
      size="md"
      ariaLabel={label}
    />
  );
}
