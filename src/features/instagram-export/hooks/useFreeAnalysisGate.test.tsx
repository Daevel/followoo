import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  FREE_ANALYSIS_FLAG_KEY,
  hasUsedFreeAnalysis,
  markFreeAnalysisUsed,
  useFreeAnalysisGate,
} from "./useFreeAnalysisGate";

const useAuthMock = vi.fn();
const useFeatureFlagMock = vi.fn();

vi.mock("@clerk/react", () => ({
  useAuth: () => useAuthMock(),
}));

// useFreeAnalysisGate's own job is "react correctly to whatever the flag
// says" - useFeatureFlag's PostHog wiring (default-first, onFeatureFlags
// subscription, ...) has its own dedicated test file.
vi.mock("@/analytics", () => ({
  useFeatureFlag: (key: string, defaultValue: boolean) =>
    useFeatureFlagMock(key, defaultValue),
}));

// Node (the vitest "unit" project's environment) has no localStorage
// global; this minimal in-memory stand-in is enough for the two pure
// functions under test, which only ever call getItem/setItem.
class MemoryStorage {
  private store = new Map<string, string>();

  getItem(key: string): string | null {
    return this.store.has(key) ? (this.store.get(key) as string) : null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  clear(): void {
    this.store.clear();
  }
}

beforeEach(() => {
  (globalThis as { localStorage?: Storage }).localStorage =
    new MemoryStorage() as unknown as Storage;
});

describe("hasUsedFreeAnalysis", () => {
  it("is false when nothing has been stored yet", () => {
    expect(hasUsedFreeAnalysis()).toBe(false);
  });

  it("is true after markFreeAnalysisUsed was called", () => {
    markFreeAnalysisUsed();

    expect(hasUsedFreeAnalysis()).toBe(true);
  });

  it("reads the exact key markFreeAnalysisUsed writes", () => {
    localStorage.setItem(FREE_ANALYSIS_FLAG_KEY, "true");

    expect(hasUsedFreeAnalysis()).toBe(true);
  });

  it("is false when localStorage.getItem throws", () => {
    (globalThis as { localStorage?: Storage }).localStorage = {
      getItem: () => {
        throw new Error("storage disabled");
      },
    } as unknown as Storage;

    expect(hasUsedFreeAnalysis()).toBe(false);
  });
});

describe("markFreeAnalysisUsed", () => {
  it("does not throw when localStorage.setItem throws", () => {
    (globalThis as { localStorage?: Storage }).localStorage = {
      setItem: () => {
        throw new Error("storage disabled");
      },
    } as unknown as Storage;

    expect(() => markFreeAnalysisUsed()).not.toThrow();
  });
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("useFreeAnalysisGate with the account-gate flag enabled (true, the default)", () => {
  beforeEach(() => {
    useAuthMock.mockReturnValue({ isSignedIn: false });
    useFeatureFlagMock.mockReturnValue(true);
  });

  it("allows the first anonymous analysis", () => {
    const { result } = renderHook(() => useFreeAnalysisGate());

    let allowed = false;
    act(() => {
      allowed = result.current.requestAnalysis();
    });

    expect(allowed).toBe(true);
    expect(result.current.needsAccountPrompt).toBe(false);
  });

  it("blocks a second anonymous analysis - unchanged from Task 2 behavior", () => {
    markFreeAnalysisUsed();

    const { result } = renderHook(() => useFreeAnalysisGate());

    let allowed = true;
    act(() => {
      allowed = result.current.requestAnalysis();
    });

    expect(allowed).toBe(false);
    expect(result.current.needsAccountPrompt).toBe(true);
  });

  it("does not block a signed-in user regardless of the local flag", () => {
    useAuthMock.mockReturnValue({ isSignedIn: true });
    markFreeAnalysisUsed();

    const { result } = renderHook(() => useFreeAnalysisGate());

    let allowed = false;
    act(() => {
      allowed = result.current.requestAnalysis();
    });

    expect(allowed).toBe(true);
    expect(result.current.needsAccountPrompt).toBe(false);
  });
});

describe("useFreeAnalysisGate with the account-gate flag disabled (kill switch off)", () => {
  beforeEach(() => {
    useAuthMock.mockReturnValue({ isSignedIn: false });
    useFeatureFlagMock.mockReturnValue(false);
  });

  it("never needs an account prompt, even with the free-analysis flag already set", () => {
    markFreeAnalysisUsed();

    const { result } = renderHook(() => useFreeAnalysisGate());

    let allowed = false;
    act(() => {
      allowed = result.current.requestAnalysis();
    });

    expect(allowed).toBe(true);
    expect(result.current.needsAccountPrompt).toBe(false);
  });

  it("still writes the localStorage flag on markAnalysisCompleted - the kill switch only affects the prompt decision", () => {
    const { result } = renderHook(() => useFreeAnalysisGate());

    act(() => {
      result.current.markAnalysisCompleted();
    });

    expect(hasUsedFreeAnalysis()).toBe(true);
  });

  it("resets an already-shown prompt back to false if the flag flips off while it is showing", () => {
    useFeatureFlagMock.mockReturnValue(true);
    markFreeAnalysisUsed();

    const { result, rerender } = renderHook(() => useFreeAnalysisGate());

    act(() => {
      result.current.requestAnalysis();
    });
    expect(result.current.needsAccountPrompt).toBe(true);

    useFeatureFlagMock.mockReturnValue(false);
    rerender();

    expect(result.current.needsAccountPrompt).toBe(false);
  });
});
