import { useEffect, useState } from "react";
import { initializePostHog } from "./posthogInit";

/**
 * A PostHog feature flag, default-first.
 *
 * Followoo is a client-rendered SPA with no server-side bootstrapping: the
 * first render always returns `defaultValue` (never `undefined`/`false`
 * implicitly), and only updates once PostHog has actually loaded flags for
 * this user. A slow network or a PostHog outage never changes behavior -
 * it just means the app keeps doing what `defaultValue` already says it
 * should, which must match today's real behavior for whatever this flag
 * guards.
 */
export function useFeatureFlag(key: string, defaultValue: boolean): boolean {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    async function subscribe() {
      // Idempotent and already in-flight/resolved most of the time (see
      // src/main.tsx) - awaiting it here just means "wait until
      // window.posthog is guaranteed to either exist or never will."
      await initializePostHog();

      if (cancelled) return;

      const posthog = window.posthog;

      if (!posthog) return;

      const syncValue = () => {
        const flagValue = posthog.isFeatureEnabled(key);
        setValue(flagValue === undefined ? defaultValue : flagValue);
      };

      syncValue();
      unsubscribe = posthog.onFeatureFlags(syncValue);
    }

    void subscribe();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [key, defaultValue]);

  return value;
}
