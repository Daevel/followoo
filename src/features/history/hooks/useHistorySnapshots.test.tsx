import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ERROR_CODES } from "@/errors";
import { useHistorySnapshots } from "./useHistorySnapshots";

const useAuthMock = vi.fn();
const handleAppErrorMock = vi.fn();
const listSnapshotsMock = vi.fn();
const deleteSnapshotMock = vi.fn();

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
  listSnapshots: (...args: unknown[]) => listSnapshotsMock(...args),
  deleteSnapshot: (...args: unknown[]) => deleteSnapshotMock(...args),
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe("useHistorySnapshots", () => {
  it("loads the list on mount", async () => {
    useAuthMock.mockReturnValue({
      getToken: vi.fn().mockResolvedValue("token-123"),
    });
    listSnapshotsMock.mockResolvedValue([
      { id: "1", createdAt: "2026-10-01T00:00:00Z" },
      { id: "2", createdAt: "2026-10-02T00:00:00Z" },
    ]);

    const { result } = renderHook(() => useHistorySnapshots());

    await waitFor(() => {
      expect(result.current.status).toBe("loaded");
    });
    expect(result.current.items).toHaveLength(2);
    expect(listSnapshotsMock).toHaveBeenCalledWith("token-123");
  });

  it("reports HISTORY_LIST_FETCH_FAILED when listing fails", async () => {
    useAuthMock.mockReturnValue({
      getToken: vi.fn().mockResolvedValue("token-123"),
    });
    listSnapshotsMock.mockRejectedValue(new Error("status 500"));

    const { result } = renderHook(() => useHistorySnapshots());

    await waitFor(() => {
      expect(result.current.status).toBe("error");
    });
    const [error] = handleAppErrorMock.mock.calls[0];
    expect(error).toMatchObject({
      code: ERROR_CODES.HISTORY_LIST_FETCH_FAILED,
    });
  });

  it("reports AUTH_SESSION_UNAVAILABLE when getToken() resolves to null", async () => {
    useAuthMock.mockReturnValue({ getToken: vi.fn().mockResolvedValue(null) });

    const { result } = renderHook(() => useHistorySnapshots());

    await waitFor(() => {
      expect(result.current.status).toBe("error");
    });
    const [error] = handleAppErrorMock.mock.calls[0];
    expect(error).toMatchObject({ code: ERROR_CODES.AUTH_SESSION_UNAVAILABLE });
    expect(listSnapshotsMock).not.toHaveBeenCalled();
  });

  it("removes a snapshot from the list on successful delete", async () => {
    useAuthMock.mockReturnValue({
      getToken: vi.fn().mockResolvedValue("token-123"),
    });
    listSnapshotsMock.mockResolvedValue([
      { id: "1", createdAt: "2026-10-01T00:00:00Z" },
      { id: "2", createdAt: "2026-10-02T00:00:00Z" },
    ]);
    deleteSnapshotMock.mockResolvedValue(undefined);

    const { result } = renderHook(() => useHistorySnapshots());
    await waitFor(() => {
      expect(result.current.status).toBe("loaded");
    });

    let removed = false;
    await act(async () => {
      removed = await result.current.removeSnapshot("1");
    });

    expect(removed).toBe(true);
    expect(result.current.items).toEqual([
      { id: "2", createdAt: "2026-10-02T00:00:00Z" },
    ]);
  });

  it("reports HISTORY_SNAPSHOT_DELETE_FAILED and keeps the item when delete fails", async () => {
    useAuthMock.mockReturnValue({
      getToken: vi.fn().mockResolvedValue("token-123"),
    });
    listSnapshotsMock.mockResolvedValue([
      { id: "1", createdAt: "2026-10-01T00:00:00Z" },
    ]);
    deleteSnapshotMock.mockRejectedValue(new Error("status 500"));

    const { result } = renderHook(() => useHistorySnapshots());
    await waitFor(() => {
      expect(result.current.status).toBe("loaded");
    });

    let removed = true;
    await act(async () => {
      removed = await result.current.removeSnapshot("1");
    });

    expect(removed).toBe(false);
    expect(result.current.items).toEqual([
      { id: "1", createdAt: "2026-10-01T00:00:00Z" },
    ]);
    const [error] = handleAppErrorMock.mock.calls[0];
    expect(error).toMatchObject({
      code: ERROR_CODES.HISTORY_SNAPSHOT_DELETE_FAILED,
    });
  });
});
