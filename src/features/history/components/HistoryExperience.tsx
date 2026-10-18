import { useAuth } from "@clerk/react";
import { useRef, useState } from "react";
import { useFeatureFlag } from "@/analytics";
import { useStandardPageAnimation } from "@/animations/pages/useStandardPageAnimation";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Checkbox } from "@/components/ui/Checkbox";
import { Container } from "@/components/ui/Container";
import { FabIcon } from "@/components/ui/FabIcon";
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

export function HistoryExperience() {
  const { isSignedIn } = useAuth();
  const isSyncEnabled = useFeatureFlag(SYNC_FEATURE_FLAG_KEY, false);
  const { status, masterKey } = useSyncKey();
  const [openedAnalysis, setOpenedAnalysis] =
    useState<InstagramAnalysisResult | null>(null);
  const [comparisonResult, setComparisonResult] =
    useState<AnalysisComparison | null>(null);

  const rootRef = useRef<HTMLDivElement | null>(null);
  useStandardPageAnimation(rootRef, {
    animateItems: status === "unlocked" && !comparisonResult,
  });

  // Reusing ResultsExperience as-is (it renders its own NavBar, which
  // already carries a link back to /history once unlocked) instead of
  // building a second results UI from scratch.
  if (openedAnalysis) {
    return <ResultsExperience analysis={openedAnalysis} />;
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
              {!isSignedIn || !isSyncEnabled ? (
                <Callout title="Not available" variant="info">
                  Encrypted history isn't available for your account right now.
                </Callout>
              ) : status === "checking" ? (
                <Skeleton
                  variant="list"
                  items={3}
                  lines={1}
                  shape="rectangle"
                  animation="wave"
                  size="md"
                  ariaLabel="Checking encrypted history status"
                />
              ) : status === "unavailable" ? (
                <Callout title="Something went wrong" variant="danger">
                  We couldn't check your encrypted history status. Please try
                  again later.
                </Callout>
              ) : status === "inactive" ? (
                <Callout title="Not activated yet" variant="info">
                  Use the "Encrypted history" button in the navigation bar to
                  activate your history - it's always free.
                </Callout>
              ) : status === "locked" ? (
                <Callout title="Locked" variant="info" icon="lock">
                  Use the "Unlock encrypted history" button in the navigation
                  bar to unlock your history for this session.
                </Callout>
              ) : masterKey ? (
                comparisonResult ? (
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
                )
              ) : null}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
