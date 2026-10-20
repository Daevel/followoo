import { lazy, Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useSyncKey } from "@/providers/SyncKeyProvider";
import { toastService } from "@/services/toastService";
import type { InstagramAnalysisResult } from "@/types/instagram.types";
import { useAutoSaveSnapshot } from "../hooks/useAutoSaveSnapshot";

const SyncUnlockWizard = lazy(() =>
  import("@/features/sync/components/SyncUnlockWizard").then((module) => ({
    default: module.SyncUnlockWizard,
  }))
);

type HistorySavePromptProps = {
  analysis: InstagramAnalysisResult;
};

/**
 * Shown on the results of a fresh analysis when encrypted history is
 * activated but was locked, so the analysis wasn't saved. Never blocks:
 * the results are already on screen. "Unlock and save" opens the unlock
 * dialog and saves this analysis as soon as history is unlocked.
 */
export function HistorySavePrompt({ analysis }: HistorySavePromptProps) {
  const { status } = useSyncKey();
  const { saveSnapshot } = useAutoSaveSnapshot();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isSaved || isDismissed || status !== "unlocked") return;

    // Unlocked from this prompt, or elsewhere in the meantime: save now.
    if (saveSnapshot(analysis) === "saving") {
      setIsSaved(true);
      toastService.success({
        title: "Saved to your history",
        description: "You can compare this analysis from the History page.",
      });
    }
  }, [status, isSaved, isDismissed, analysis, saveSnapshot]);

  // The dialog outlives the banner: after a recovery-code unlock it still
  // offers to set a new passphrase.
  const isBannerVisible = !isSaved && !isDismissed && status === "locked";

  return (
    <>
      {isBannerVisible && (
        <section
          aria-label="History"
          className="border-line-subtle bg-surface-1 flex flex-wrap items-center gap-x-4 gap-y-3 rounded-card border px-4 py-3.5"
        >
          <span className="bg-surface-2 text-brand-fg flex size-9 shrink-0 items-center justify-center rounded-control">
            <Icon
              name="lock"
              color="current"
              width={16}
              height={16}
              aria-hidden="true"
            />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-fg text-sm font-semibold">
              This analysis isn&apos;t in your history yet
            </p>
            <p className="text-fg-muted mt-0.5 text-[13px]">
              Unlock your encrypted history to save it and compare it later.
            </p>
          </div>
          <div className="flex w-full justify-end gap-2 sm:w-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDismissed(true)}
            >
              Not now
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsDialogOpen(true)}
            >
              Unlock and save
            </Button>
          </div>
        </section>
      )}

      {isDialogOpen && (
        <Suspense fallback={null}>
          <SyncUnlockWizard onClose={() => setIsDialogOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
