import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ERROR_CODES } from "@/errors";
import {
  encryptWithMasterKey,
  generateMasterKey,
} from "@/features/sync/crypto";
import type { InstagramAnalysisResult } from "@/types/instagram.types";
import { useOpenSnapshot } from "./useOpenSnapshot";

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

const analysis: InstagramAnalysisResult = {
  mutual: [{ username: "a" }],
  followersOnly: [],
  unfollowers: [],
  recentUnfollowers: [],
  blocked: [],
  restricted: [],
  closeFriends: [],
  hideStoriesFrom: [],
  pendingFollowRequests: [],
  recentFollowRequests: [],
  sourceCounts: { followers: 1, following: 1 },
};

describe("useOpenSnapshot", () => {
  it("fetches and decrypts a snapshot back into the original analysis", async () => {
    const masterKey = generateMasterKey();
    const encrypted = await encryptWithMasterKey(
      masterKey,
      JSON.stringify(analysis)
    );
    useAuthMock.mockReturnValue({
      getToken: vi.fn().mockResolvedValue("token-123"),
    });
    getSnapshotMock.mockResolvedValue({
      id: "1",
      createdAt: "2026-10-01T00:00:00Z",
      encryptedBlob: encrypted.ciphertext,
      iv: encrypted.iv,
    });

    const { result } = renderHook(() => useOpenSnapshot());

    let opened: InstagramAnalysisResult | null = null;
    await act(async () => {
      opened = await result.current.openSnapshot("1", masterKey);
    });

    expect(opened).toEqual(analysis);
    expect(handleAppErrorMock).not.toHaveBeenCalled();
  });

  it("reports HISTORY_SNAPSHOT_FETCH_FAILED when the fetch fails", async () => {
    useAuthMock.mockReturnValue({
      getToken: vi.fn().mockResolvedValue("token-123"),
    });
    getSnapshotMock.mockRejectedValue(new Error("status 404"));

    const { result } = renderHook(() => useOpenSnapshot());

    let opened: InstagramAnalysisResult | null = analysis;
    await act(async () => {
      opened = await result.current.openSnapshot("1", generateMasterKey());
    });

    expect(opened).toBeNull();
    const [error] = handleAppErrorMock.mock.calls[0];
    expect(error).toMatchObject({
      code: ERROR_CODES.HISTORY_SNAPSHOT_FETCH_FAILED,
    });
  });

  it("reports HISTORY_SNAPSHOT_DECRYPT_FAILED when the master key doesn't match (real error, not validation)", async () => {
    const masterKey = generateMasterKey();
    const wrongKey = generateMasterKey();
    const encrypted = await encryptWithMasterKey(
      masterKey,
      JSON.stringify(analysis)
    );
    useAuthMock.mockReturnValue({
      getToken: vi.fn().mockResolvedValue("token-123"),
    });
    getSnapshotMock.mockResolvedValue({
      id: "1",
      createdAt: "2026-10-01T00:00:00Z",
      encryptedBlob: encrypted.ciphertext,
      iv: encrypted.iv,
    });

    const { result } = renderHook(() => useOpenSnapshot());

    let opened: InstagramAnalysisResult | null = analysis;
    await act(async () => {
      opened = await result.current.openSnapshot("1", wrongKey);
    });

    expect(opened).toBeNull();
    const [error] = handleAppErrorMock.mock.calls[0];
    expect(error).toMatchObject({
      code: ERROR_CODES.HISTORY_SNAPSHOT_DECRYPT_FAILED,
    });
  });
});
