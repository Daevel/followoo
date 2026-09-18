import { useAuth } from "@clerk/react";
import { useEffect, useRef } from "react";
import { initializePostHog } from "./posthogInit";

/**
 * Links Clerk sign-in state to PostHog's distinct_id, so pre-login and
 * post-login activity share one identity and per-user flag targeting
 * becomes possible later. Mount this once near the app root (see
 * src/AppRoutes.tsx) - it has no UI of its own.
 *
 * Only the Clerk user id is ever passed to identify() - the same "sub"
 * claim already used as users.id on the backend, never any Instagram
 * export or relationship data (see project-context).
 */
export function usePostHogIdentity(): void {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const identifiedUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    let cancelled = false;

    async function syncIdentity() {
      await initializePostHog();

      if (cancelled) return;

      const posthog = window.posthog;

      if (!posthog) return;

      if (isSignedIn && userId) {
        if (identifiedUserIdRef.current !== userId) {
          posthog.identify(userId);
          identifiedUserIdRef.current = userId;
        }

        return;
      }

      if (!isSignedIn && identifiedUserIdRef.current !== null) {
        posthog.reset();
        identifiedUserIdRef.current = null;
      }
    }

    void syncIdentity();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, userId]);
}
