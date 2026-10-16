import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ERROR_CODES } from "@/errors";
import { generateMasterKey } from "@/features/sync/crypto";
import type { InstagramAnalysisResult } from "@/types/instagram.types";
import { useAutoSaveSnapshot } from "./useAutoSaveSnapshot";

const useAuthMock = vi.fn();
const useSyncKeyMock = vi.fn();
const handleAppErrorMock = vi.fn();
const createSnapshotMock = vi.fn();

vi.mock("@clerk/react", () => ({
  useAuth: () => useAuthMock(),
}));

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
  createSnapshot: (...args: unknown[]) => createSnapshotMock(...args),
}));

afterEach(() => {
  vi.clearAllMocks();
});

const analysis: InstagramAnalysisResult = {
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
};

describe("useAutoSaveSnapshot", () => {
  it("does nothing when signed out", () => {
    useAuthMock.mockReturnValue({
      isSignedIn: false,
      getToken: vi.fn(),
    });
    useSyncKeyMock.mockReturnValue({
      status: "unlocked",
      masterKey: generateMasterKey(),
    });

    const { result } = renderHook(() => useAutoSaveSnapshot());
    result.current.saveSnapshot(analysis);

    expect(createSnapshotMock).not.toHaveBeenCalled();
  });

  it("does nothing when sync is not unlocked", () => {
    useAuthMock.mockReturnValue({ isSignedIn: true, getToken: vi.fn() });
    useSyncKeyMock.mockReturnValue({ status: "locked", masterKey: null });

    const { result } = renderHook(() => useAutoSaveSnapshot());
    result.current.saveSnapshot(analysis);

    expect(createSnapshotMock).not.toHaveBeenCalled();
  });

  it("encrypts and saves the analysis without blocking the caller", async () => {
    const masterKey = generateMasterKey();
    useAuthMock.mockReturnValue({
      isSignedIn: true,
      getToken: vi.fn().mockResolvedValue("token-123"),
    });
    useSyncKeyMock.mockReturnValue({ status: "unlocked", masterKey });
    createSnapshotMock.mockResolvedValue(undefined);

    const { result } = renderHook(() => useAutoSaveSnapshot());
    const returnValue = result.current.saveSnapshot(analysis);

    expect(returnValue).toBeUndefined();

    await waitFor(() => {
      expect(createSnapshotMock).toHaveBeenCalledTimes(1);
    });

    const [token, payload] = createSnapshotMock.mock.calls[0];
    expect(token).toBe("token-123");
    // Only ciphertext/iv ever leave this hook - never the plaintext
    // analysis or anything resembling it.
    expect(payload.encryptedBlob).toBeTypeOf("string");
    expect(payload.encryptedBlob).not.toContain("mutual");
    expect(payload.iv).toBeTypeOf("string");
    expect(handleAppErrorMock).not.toHaveBeenCalled();
  });

  it("reports AUTH_SESSION_UNAVAILABLE (without a toast) when getToken() fails", async () => {
    useAuthMock.mockReturnValue({
      isSignedIn: true,
      getToken: vi.fn().mockRejectedValue(new Error("clerk down")),
    });
    useSyncKeyMock.mockReturnValue({
      status: "unlocked",
      masterKey: generateMasterKey(),
    });

    const { result } = renderHook(() => useAutoSaveSnapshot());
    result.current.saveSnapshot(analysis);

    await waitFor(() => {
      expect(handleAppErrorMock).toHaveBeenCalledTimes(1);
    });
    const [error, options] = handleAppErrorMock.mock.calls[0];
    expect(error).toMatchObject({ code: ERROR_CODES.AUTH_SESSION_UNAVAILABLE });
    expect(options).toMatchObject({ showToast: false });
    expect(createSnapshotMock).not.toHaveBeenCalled();
  });

  it("reports HISTORY_SNAPSHOT_SAVE_FAILED (without a toast) when saving fails", async () => {
    useAuthMock.mockReturnValue({
      isSignedIn: true,
      getToken: vi.fn().mockResolvedValue("token-123"),
    });
    useSyncKeyMock.mockReturnValue({
      status: "unlocked",
      masterKey: generateMasterKey(),
    });
    createSnapshotMock.mockRejectedValue(new Error("status 500"));

    const { result } = renderHook(() => useAutoSaveSnapshot());
    result.current.saveSnapshot(analysis);

    await waitFor(() => {
      expect(handleAppErrorMock).toHaveBeenCalledTimes(1);
    });
    const [error, options] = handleAppErrorMock.mock.calls[0];
    expect(error).toMatchObject({
      code: ERROR_CODES.HISTORY_SNAPSHOT_SAVE_FAILED,
    });
    expect(options).toMatchObject({ showToast: false });
  });
});
