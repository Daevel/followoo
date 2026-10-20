import { SignInButton, useAuth } from "@clerk/react";
import {
  lazy,
  type ReactNode,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import { useFeatureFlag } from "@/analytics";
import { useStandardPageAnimation } from "@/animations/pages/useStandardPageAnimation";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Checkbox } from "@/components/ui/Checkbox";
import { Container } from "@/components/ui/Container";
import { FabIcon } from "@/components/ui/FabIcon";
import { Icon, type IconName } from "@/components/ui/Icon";
import { NavBar } from "@/components/ui/NavBar";
import { PageHeader } from "@/components/ui/PageHeader";
import Seo from "@/components/ui/Seo";
import { Skeleton } from "@/components/ui/Skeleton";
import type { AnalysisComparison } from "@/features/relationship/services/analysisComparisonService";
import { ResultsExperience } from "@/features/results/components/ResultsExperience";
import { SYNC_FEATURE_FLAG_KEY } from "@/features/sync/constants";
import { useSyncKey } from "@/providers/SyncKeyProvider";
import type { InstagramAnalysisResult } from "@/types/instagram.types";
import { useHistorySnapshots } from "../hooks/useHistorySnapshots";
import { useOpenSnapshot } from "../hooks/useOpenSnapshot";
import { useSnapshotComparison } from "../hooks/useSnapshotComparison";
import { formatSnapshotDate } from "../utils/formatSnapshotDate";
import { SnapshotComparisonView } from "./SnapshotComparisonView";

// Only mounted once encrypted history is unlocked - its own data fetch
// (useHistorySnapshots) has no reason to run otherwise.
function HistoryList({
  masterKey,
  onOpen,
  onCompared,
}: {
  masterKey: Uint8Array<ArrayBuffer>;
  onOpen: (analysis: InstagramAnalysisResult) => void;
  onCompared: (comparison: AnalysisComparison) => void;
}) {
  const { items, status, removeSnapshot } = useHistorySnapshots();
  const { openSnapshot, status: openStatus } = useOpenSnapshot();
  const { status: comparisonStatus, compare } = useSnapshotComparison();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const isComparing = comparisonStatus === "loading";

  function toggleSelected(id: string) {
    setSelectedIds((previous) => {
      if (previous.includes(id)) {
        return previous.filter((selectedId) => selectedId !== id);
      }

      if (previous.length >= 2) {
        return previous;
      }

      return [...previous, id];
    });
  }

  async function handleOpen(id: string) {
    setPendingId(id);
    const analysis = await openSnapshot(id, masterKey);
    setPendingId(null);

    if (analysis) {
      onOpen(analysis);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this history entry? This cannot be undone.")) {
      return;
    }

    setPendingId(id);
    await removeSnapshot(id);
    setPendingId(null);
    setSelectedIds((previous) =>
      previous.filter((selectedId) => selectedId !== id)
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
      <p className="text-fg-muted text-start">
        No saved analyses yet. Run an analysis while signed in to start building
        your history.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {items.length < 2 ? (
        <Callout title="Not enough history yet" variant="info">
          Save at least one more analysis to be able to compare two snapshots.
        </Callout>
      ) : (
        <div className="flex items-center justify-between gap-3">
          <p className="text-fg-muted text-[13px]">
            Select exactly two entries to compare them.
          </p>
          <Button
            size="sm"
            disabled={selectedIds.length !== 2}
            loading={isComparing}
            onClick={handleCompare}
          >
            Compare
          </Button>
        </div>
      )}

      <ul className="flex flex-col">
        {items.map((item) => {
          const isPending = pendingId === item.id && openStatus === "loading";
          const isDeleting = pendingId === item.id;
          const isSelected = selectedIds.includes(item.id);
          const isSelectionDisabled =
            isComparing || (!isSelected && selectedIds.length >= 2);

          return (
            <li
              key={item.id}
              className="border-line-subtle flex items-center justify-between gap-4 border-t py-4 text-start"
            >
              <span className="flex items-center gap-3">
                {items.length >= 2 && (
                  <Checkbox
                    checked={isSelected}
                    disabled={isSelectionDisabled}
                    onChange={() => toggleSelected(item.id)}
                    aria-label={`Select ${formatSnapshotDate(item.createdAt)} for comparison`}
                  />
                )}
                <span className="text-fg text-sm font-medium">
                  {formatSnapshotDate(item.createdAt)}
                </span>
              </span>

              <span className="flex items-center gap-2">
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
                  onClick={() => handleDelete(item.id)}
                  aria-label="Delete this history entry"
                />
              </span>
            </li>
          );
        })}
      </ul>
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

  // Reusing ResultsExperience as-is (its NavBar carries the History link)
  // instead of building a second results UI from scratch.
  if (openedAnalysis) {
    return <ResultsExperience analysis={openedAnalysis} />;
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
        onBack={() => setComparisonResult(null)}
      />
    ) : (
      <HistoryList
        masterKey={masterKey}
        onOpen={setOpenedAnalysis}
        onCompared={setComparisonResult}
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
              description="Every entry is encrypted in your browser before it reaches our servers - only the date is ever stored in the clear."
            />

            <div data-page-animate="content" className="flex w-full flex-col">
              {renderContent()}
            </div>
          </div>
        </Container>
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
