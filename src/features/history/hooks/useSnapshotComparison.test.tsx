import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { AnalysisComparison } from "@/features/relationship/services/analysisComparisonService";
import {
  encryptWithMasterKey,
  generateMasterKey,
} from "@/features/sync/crypto";
import type { InstagramAnalysisResult } from "@/types/instagram.types";
import type { SnapshotListItem } from "../services/historyService";
import { useSnapshotComparison } from "./useSnapshotComparison";

const useAuthMock = vi.fn();
const handleAppErrorMock = vi.fn();
const getSnapshotMock = vi.fn();

vi.mock("@clerk/react", () => ({
  useAuth: () => useAuthMock(),
}));

vi.mock("@/errors", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/errors")>();
  return {
    ...actual,
    handleAppError: (...args: Parameters<typeof actual.handleAppError>) =>
      handleAppErrorMock(...args),
  };
});

vi.mock("../services/historyService", () => ({
  getSnapshot: (...args: unknown[]) => getSnapshotMock(...args),
}));

afterEach(() => {
  vi.clearAllMocks();
});

function buildAnalysis(
  overrides: Partial<InstagramAnalysisResult>
): InstagramAnalysisResult {
  return {
    mutual: [],
    followersOnly: [],
    unfollowers: [],
    recentUnfollowers: [],
    blocked: [],
    restricted: [],
    closeFriends: [],
    hideStoriesFrom: [],
    pendingFollowRequests: [],
    recentFollowRequests: [],
    sourceCounts: { followers: 0, following: 0 },
    ...overrides,
  };
}

async function encryptedSnapshot(
  id: string,
  createdAt: string,
  analysis: InstagramAnalysisResult,
  masterKey: Uint8Array<ArrayBuffer>
) {
  const encrypted = await encryptWithMasterKey(
    masterKey,
    JSON.stringify(analysis)
  );
  return {
    id,
    createdAt,
    encryptedBlob: encrypted.ciphertext,
    iv: encrypted.iv,
  };
}

describe("useSnapshotComparison", () => {
  it("fetches, decrypts and diffs both snapshots on success", async () => {
    const masterKey = generateMasterKey();
    useAuthMock.mockReturnValue({
      getToken: vi.fn().mockResolvedValue("token-123"),
    });

    const olderAnalysis = buildAnalysis({
      followersOnly: [{ username: "bob" }],
    });
    const newerAnalysis = buildAnalysis({
      followersOnly: [{ username: "carol" }],
    });
    const olderItem: SnapshotListItem = {
      id: "a",
      createdAt: "2026-09-01T00:00:00Z",
    };
    const newerItem: SnapshotListItem = {
      id: "b",
      createdAt: "2026-10-01T00:00:00Z",
    };

    getSnapshotMock.mockImplementation(async (_token: string, id: string) => {
      if (id === "a") {
        return encryptedSnapshot(
          "a",
          olderItem.createdAt,
          olderAnalysis,
          masterKey
        );
      }
      return encryptedSnapshot(
        "b",
        newerItem.createdAt,
        newerAnalysis,
        masterKey
      );
    });

    const { result } = renderHook(() => useSnapshotComparison());

    // A plain `let` mutated inside the act() closure keeps TS's control
    // flow analysis pinned to the literal `null` initializer outside it -
    // a holder object sidesteps that narrowing quirk cleanly.
    const holder: { value: AnalysisComparison | null } = { value: null };
    await act(async () => {
      holder.value = await result.current.compare(
        olderItem,
        newerItem,
        masterKey
      );
    });
    const comparison = holder.value;

    if (!comparison) {
      throw new Error("expected a comparison result");
    }

    expect(comparison.newFollowers.count).toBe(1);
    expect(comparison.newFollowers.users[0]?.username).toBe("carol");
    expect(comparison.lostFollowers.count).toBe(1);
    expect(comparison.lostFollowers.users[0]?.username).toBe("bob");
    expect(result.current.status).toBe("ready");
  });

  it("returns null and never builds a partial comparison when one fetch fails", async () => {
    const masterKey = generateMasterKey();
    useAuthMock.mockReturnValue({
      getToken: vi.fn().mockResolvedValue("token-123"),
    });

    const okItem: SnapshotListItem = {
      id: "a",
      createdAt: "2026-09-01T00:00:00Z",
    };
    const failingItem: SnapshotListItem = {
      id: "b",
      createdAt: "2026-10-01T00:00:00Z",
    };

    getSnapshotMock.mockImplementation(async (_token: string, id: string) => {
      if (id === "a") {
        return encryptedSnapshot(
          "a",
          okItem.createdAt,
          buildAnalysis({}),
          masterKey
        );
      }
      throw new Error("status 404");
    });

    const { result } = renderHook(() => useSnapshotComparison());

    let comparison: AnalysisComparison | null = null;
    await act(async () => {
      comparison = await result.current.compare(okItem, failingItem, masterKey);
    });

    expect(comparison).toBeNull();
    await waitFor(() => {
      expect(result.current.status).toBe("error");
    });
    // The failing fetch already reported its own AppError/toast (same as
    // opening a single entry would) - nothing silent here.
    expect(handleAppErrorMock).toHaveBeenCalled();
  });

  it("returns null when both fetches fail", async () => {
    useAuthMock.mockReturnValue({
      getToken: vi.fn().mockResolvedValue("token-123"),
    });
    getSnapshotMock.mockRejectedValue(new Error("status 500"));

    const { result } = renderHook(() => useSnapshotComparison());

    const itemA: SnapshotListItem = {
      id: "a",
      createdAt: "2026-09-01T00:00:00Z",
    };
    const itemB: SnapshotListItem = {
      id: "b",
      createdAt: "2026-10-01T00:00:00Z",
    };

    let comparison: AnalysisComparison | null = null;
    await act(async () => {
      comparison = await result.current.compare(
        itemA,
        itemB,
        generateMasterKey()
      );
    });

    expect(comparison).toBeNull();
    expect(result.current.status).toBe("error");
  });
});
