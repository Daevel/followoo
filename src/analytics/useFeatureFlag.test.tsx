import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useFeatureFlag } from "./useFeatureFlag";

vi.mock("./posthogInit", () => ({
  initializePostHog: vi.fn().mockResolvedValue(undefined),
}));

type FeatureFlagsCallback = () => void;

function stubPostHog(isFeatureEnabled: () => boolean | undefined) {
  let callback: FeatureFlagsCallback | null = null;
  const unsubscribe = vi.fn();

  window.posthog = {
    isFeatureEnabled: vi.fn(isFeatureEnabled),
    onFeatureFlags: vi.fn((cb: FeatureFlagsCallback) => {
      callback = cb;
      return unsubscribe;
    }),
    // biome-ignore lint/suspicious/noExplicitAny: minimal stub of the real PostHog client for this test only.
  } as any;

  return {
    unsubscribe,
    triggerFlagsLoaded: () => {
      act(() => {
        callback?.();
      });
    },
  };
}

afterEach(() => {
  window.posthog = undefined;
  vi.clearAllMocks();
});

describe("useFeatureFlag", () => {
  it("returns the default value on first render, before PostHog responds", () => {
    stubPostHog(() => true);

    const { result } = renderHook(() => useFeatureFlag("my-flag", false));

    expect(result.current).toBe(false);
  });

  it("updates to the real value once onFeatureFlags fires", async () => {
    const { triggerFlagsLoaded } = stubPostHog(() => false);

    const { result } = renderHook(() => useFeatureFlag("my-flag", true));

    triggerFlagsLoaded();

    await waitFor(() => {
      expect(result.current).toBe(false);
    });
  });

  it("falls back to the default when PostHog has no opinion (undefined)", async () => {
    const { triggerFlagsLoaded } = stubPostHog(() => undefined);

    const { result } = renderHook(() => useFeatureFlag("my-flag", true));

    triggerFlagsLoaded();

    // No state change is expected here (already at the default), so there
    // is nothing for waitFor to wait on - flush the mocked async init and
    // re-assert instead.
    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current).toBe(true);
  });

  it("stays on the default when PostHog never loaded", async () => {
    window.posthog = undefined;

    const { result } = renderHook(() => useFeatureFlag("my-flag", true));

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current).toBe(true);
  });

  it("unsubscribes from onFeatureFlags on unmount", async () => {
    const { unsubscribe } = stubPostHog(() => true);

    const { unmount } = renderHook(() => useFeatureFlag("my-flag", false));

    await act(async () => {
      await Promise.resolve();
    });

    unmount();

    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});
