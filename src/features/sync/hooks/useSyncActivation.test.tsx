import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ERROR_CODES } from "@/errors";
import { useSyncActivation } from "./useSyncActivation";

const useAuthMock = vi.fn();
const handleAppErrorMock = vi.fn();
const activateSyncMock = vi.fn();

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

vi.mock("@/features/sync/services/syncService", () => ({
  activateSync: (...args: unknown[]) => activateSyncMock(...args),
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe("useSyncActivation", () => {
  it("activates successfully: generates and wraps a master key, then calls activateSync", async () => {
    useAuthMock.mockReturnValue({
      getToken: vi.fn().mockResolvedValue("token-123"),
    });
    activateSyncMock.mockResolvedValue(undefined);

    const { result } = renderHook(() => useSyncActivation());

    let activated: Uint8Array<ArrayBuffer> | null = null;
    await act(async () => {
      activated = await result.current.activate(
        "a dedicated passphrase",
        "XK4M-9PQR-7TZC-2WFH"
      );
    });

    expect(activated).toBeInstanceOf(Uint8Array);
    expect(activated).toHaveLength(32);
    expect(result.current.status).toBe("success");
    expect(handleAppErrorMock).not.toHaveBeenCalled();

    expect(activateSyncMock).toHaveBeenCalledTimes(1);
    const [token, payload] = activateSyncMock.mock.calls[0];
    expect(token).toBe("token-123");
    // Only wrapped/derived material travels to the service - never the
    // passphrase or recovery code themselves.
    expect(payload.wrappedMasterKeyPassphrase).toBeTypeOf("string");
    expect(payload.wrappedMasterKeyRecovery).toBeTypeOf("string");
    expect(payload).not.toHaveProperty("passphrase");
    expect(payload).not.toHaveProperty("recoveryCode");
    expect(payload.wrappedMasterKeyPassphrase).not.toBe(
      payload.wrappedMasterKeyRecovery
    );
  });

  it("reports AUTH_SESSION_UNAVAILABLE when getToken() resolves to null, without calling activateSync", async () => {
    useAuthMock.mockReturnValue({ getToken: vi.fn().mockResolvedValue(null) });

    const { result } = renderHook(() => useSyncActivation());

    let activated: Uint8Array<ArrayBuffer> | null = new Uint8Array();
    await act(async () => {
      activated = await result.current.activate("a passphrase here", "code");
    });

    expect(activated).toBeNull();
    expect(result.current.status).toBe("error");
    expect(activateSyncMock).not.toHaveBeenCalled();

    const [error] = handleAppErrorMock.mock.calls[0];
    expect(error).toMatchObject({ code: ERROR_CODES.AUTH_SESSION_UNAVAILABLE });
  });

  it("reports AUTH_SESSION_UNAVAILABLE when getToken() throws", async () => {
    useAuthMock.mockReturnValue({
      getToken: vi.fn().mockRejectedValue(new Error("clerk unreachable")),
    });

    const { result } = renderHook(() => useSyncActivation());

    await act(async () => {
      await result.current.activate("a passphrase here", "code");
    });

    const [error] = handleAppErrorMock.mock.calls[0];
    expect(error).toMatchObject({ code: ERROR_CODES.AUTH_SESSION_UNAVAILABLE });
    expect(activateSyncMock).not.toHaveBeenCalled();
  });

  it("reports SYNC_ACTIVATION_FAILED when the backend call fails", async () => {
    useAuthMock.mockReturnValue({
      getToken: vi.fn().mockResolvedValue("token-123"),
    });
    activateSyncMock.mockRejectedValue(new Error("status 500"));

    const { result } = renderHook(() => useSyncActivation());

    let activated: Uint8Array<ArrayBuffer> | null = new Uint8Array();
    await act(async () => {
      activated = await result.current.activate("a passphrase here", "code");
    });

    expect(activated).toBeNull();
    expect(result.current.status).toBe("error");

    const [error] = handleAppErrorMock.mock.calls[0];
    expect(error).toMatchObject({ code: ERROR_CODES.SYNC_ACTIVATION_FAILED });
  });

  it("reset() returns the status to idle", async () => {
    useAuthMock.mockReturnValue({ getToken: vi.fn().mockResolvedValue(null) });

    const { result } = renderHook(() => useSyncActivation());

    await act(async () => {
      await result.current.activate("a passphrase here", "code");
    });
    expect(result.current.status).toBe("error");

    act(() => {
      result.current.reset();
    });

    await waitFor(() => {
      expect(result.current.status).toBe("idle");
    });
  });
});
