import { useAuth } from "@clerk/react";
import { lazy, Suspense, useState } from "react";
import { useFeatureFlag } from "@/analytics";

// Default false: history review (v3.1.0 Task 2) doesn't exist yet, so this
// entry point must stay invisible to real users until explicitly turned on
// per-user/cohort in PostHog. See this feature's README-equivalent context
// in the v3.1.0 Task 1 prompt - activation must never auto-trigger from
// sign-in/account creation, only from this explicit button.
const SYNC_ACTIVATION_FLAG_KEY = "followoo-encrypted-history-sync-enabled";

// Lazy: the wizard pulls in react-hook-form, zod, and this feature's
// crypto module. This widget itself is mounted in NavBar - on every page,
// for every visitor - so none of that should be in the main bundle until
// a signed-in, flagged-in user actually clicks the button below.
const SyncActivationWizard = lazy(() =>
  import("./SyncActivationWizard").then((module) => ({
    default: module.SyncActivationWizard,
  }))
);

export function SyncActivationWidget() {
  const { isSignedIn } = useAuth();
  const isSyncActivationEnabled = useFeatureFlag(
    SYNC_ACTIVATION_FLAG_KEY,
    false
  );
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  if (!isSignedIn || !isSyncActivationEnabled) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsWizardOpen(true)}
        className="text-fg-muted hover:text-fg text-sm font-semibold underline-offset-2 hover:underline"
      >
        Encrypted history
      </button>

      {isWizardOpen && (
        <Suspense fallback={null}>
          <SyncActivationWizard onClose={() => setIsWizardOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
