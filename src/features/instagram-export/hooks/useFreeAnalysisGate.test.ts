import { beforeEach, describe, expect, it } from "vitest";
import {
  FREE_ANALYSIS_FLAG_KEY,
  hasUsedFreeAnalysis,
  markFreeAnalysisUsed,
} from "./useFreeAnalysisGate";

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
