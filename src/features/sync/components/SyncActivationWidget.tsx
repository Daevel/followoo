import { useAuth } from "@clerk/react";
import { lazy, Suspense, useState } from "react";
import { Link } from "react-router";
import { useFeatureFlag } from "@/analytics";
import { SYNC_FEATURE_FLAG_KEY } from "@/features/sync/constants";
import { useSyncKey } from "@/providers/SyncKeyProvider";

// Lazy: both wizards pull in react-hook-form, zod, and this feature's
// crypto module. This widget itself is mounted in NavBar - on every page,
// for every visitor - so none of that should be in the main bundle until
// a signed-in, flagged-in user actually clicks the button below.
const SyncActivationWizard = lazy(() =>
  import("./SyncActivationWizard").then((module) => ({
    default: module.SyncActivationWizard,
  }))
);
const SyncUnlockWizard = lazy(() =>
  import("./SyncUnlockWizard").then((module) => ({
    default: module.SyncUnlockWizard,
  }))
);

const linkClassName =
  "text-fg-muted hover:text-fg text-sm font-semibold underline-offset-2 hover:underline";

export function SyncActivationWidget() {
  const { isSignedIn } = useAuth();
  const isSyncActivationEnabled = useFeatureFlag(SYNC_FEATURE_FLAG_KEY, false);
  const { status } = useSyncKey();
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  if (!isSignedIn || !isSyncActivationEnabled) {
    return null;
  }

  // Fail soft: no broken-looking button while the status is still being
  // checked, or if checking it failed (already reported via Sentry by
  // SyncKeyProvider) - same default-first philosophy as useFeatureFlag.
  if (status === "checking" || status === "unavailable") {
    return null;
  }

  if (status === "unlocked") {
    return (
      <Link to="/history" className={linkClassName}>
        Encrypted history
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsWizardOpen(true)}
        className={linkClassName}
      >
        {status === "locked" ? "Unlock encrypted history" : "Encrypted history"}
      </button>

      {isWizardOpen && (
        <Suspense fallback={null}>
          {status === "locked" ? (
            <SyncUnlockWizard onClose={() => setIsWizardOpen(false)} />
          ) : (
            <SyncActivationWizard onClose={() => setIsWizardOpen(false)} />
          )}
        </Suspense>
      )}
    </>
  );
}
