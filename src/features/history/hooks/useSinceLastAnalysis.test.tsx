import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  encryptWithMasterKey,
  generateMasterKey,
} from "@/features/sync/crypto";
import type { InstagramAnalysisResult } from "@/types/instagram.types";
import { useSinceLastAnalysis } from "./useSinceLastAnalysis";

const useAuthMock = vi.fn();
const useSyncKeyMock = vi.fn();
const handleAppErrorMock = vi.fn();
const listSnapshotsMock = vi.fn();
const getSnapshotMock = vi.fn();

vi.mock("@clerk/react", () => ({ useAuth: () => useAuthMock() }));
vi.mock("@/providers/SyncKeyProvider", () => ({
  useSyncKey: () => useSyncKeyMock(),
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
  listSnapshots: (...args: unknown[]) => listSnapshotsMock(...args),
  getSnapshot: (...args: unknown[]) => getSnapshotMock(...args),
}));

afterEach(() => {
  vi.clearAllMocks();
});

function build(followers: string[]): InstagramAnalysisResult {
  return {
    mutual: [],
    followersOnly: followers.map((username) => ({ username })),
    unfollowers: [],
    recentUnfollowers: [],
    blocked: [],
    restricted: [],
    closeFriends: [],
    hideStoriesFrom: [],
    pendingFollowRequests: [],
    recentFollowRequests: [],
    sourceCounts: { followers: followers.length, following: 0 },
  };
}

const masterKey = generateMasterKey();

async function stored(analysis: InstagramAnalysisResult) {
  const { ciphertext, iv } = await encryptWithMasterKey(
    masterKey,
    JSON.stringify(analysis)
  );
  return { encryptedBlob: ciphertext, iv };
}

function unlocked() {
  useAuthMock.mockReturnValue({ getToken: vi.fn().mockResolvedValue("t") });
  useSyncKeyMock.mockReturnValue({ status: "unlocked", masterKey });
}

describe("useSinceLastAnalysis", () => {
  it("skips the entry that is this same analysis and compares with the one before", async () => {
    const fresh = build(["ann", "bea"]);
    const previous = build(["ann", "carl"]);
    unlocked();
    listSnapshotsMock.mockResolvedValue([
      { id: "new", createdAt: "2026-11-24T18:00:00Z" },
      { id: "old", createdAt: "2026-10-17T09:00:00Z" },
    ]);
    getSnapshotMock.mockImplementation(async (_token: string, id: string) =>
      stored(id === "new" ? fresh : previous)
    );

    const { result } = renderHook(() => useSinceLastAnalysis(fresh, true));

    await waitFor(() => expect(result.current.status).toBe("ready"));
    if (result.current.status !== "ready") return;
    expect(result.current.comparison.older.createdAt).toBe(
      "2026-10-17T09:00:00Z"
    );
    expect(
      result.current.comparison.lostFollowers.users.map((u) => u.username)
    ).toEqual(["carl"]);
    expect(
      result.current.comparison.newFollowers.users.map((u) => u.username)
    ).toEqual(["bea"]);
  });

  it("reports none when History holds only this analysis", async () => {
    const fresh = build(["ann"]);
    unlocked();
    listSnapshotsMock.mockResolvedValue([
      { id: "new", createdAt: "2026-11-24T18:00:00Z" },
    ]);
    getSnapshotMock.mockResolvedValue(await stored(fresh));

    const { result } = renderHook(() => useSinceLastAnalysis(fresh, true));

    await waitFor(() => expect(result.current.status).toBe("none"));
  });

  it("does nothing while History is locked or for the demo", () => {
    useAuthMock.mockReturnValue({ getToken: vi.fn() });
    useSyncKeyMock.mockReturnValue({ status: "locked", masterKey: null });

    const empty = build([]);
    const locked = renderHook(() => useSinceLastAnalysis(empty, true));
    expect(locked.result.current.status).toBe("idle");

    unlocked();
    const demo = renderHook(() => useSinceLastAnalysis(empty, false));
    expect(demo.result.current.status).toBe("idle");
    expect(listSnapshotsMock).not.toHaveBeenCalled();
  });

  it("fails quietly, without a toast", async () => {
    unlocked();
    listSnapshotsMock.mockRejectedValue(new Error("offline"));
    const empty = build([]);

    const { result } = renderHook(() => useSinceLastAnalysis(empty, true));

    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(handleAppErrorMock).toHaveBeenCalledWith(expect.anything(), {
      showToast: false,
    });
  });
});
