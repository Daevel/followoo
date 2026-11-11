import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ERROR_CODES } from "@/errors";
import { useCurrentUser } from "./useCurrentUser";

const useAuthMock = vi.fn();
const handleAppErrorMock = vi.fn();
const fetchCurrentUserMock = vi.fn();

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

vi.mock("../services/usersService", () => ({
  fetchCurrentUser: (...args: unknown[]) => fetchCurrentUserMock(...args),
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe("useCurrentUser", () => {
  it("skips the fetch entirely while Clerk has not loaded yet", () => {
    useAuthMock.mockReturnValue({
      isLoaded: false,
      isSignedIn: false,
      getToken: vi.fn(),
    });

    const { result } = renderHook(() => useCurrentUser());

    expect(result.current).toEqual({
      userId: null,
      email: null,
      plan: null,
      isLoading: false,
    });
    expect(fetchCurrentUserMock).not.toHaveBeenCalled();
    expect(handleAppErrorMock).not.toHaveBeenCalled();
  });

  it("skips the fetch and clears the user when signed out", () => {
    useAuthMock.mockReturnValue({
      isLoaded: true,
      isSignedIn: false,
      getToken: vi.fn(),
    });

    const { result } = renderHook(() => useCurrentUser());

    expect(result.current.userId).toBeNull();
    expect(fetchCurrentUserMock).not.toHaveBeenCalled();
    expect(handleAppErrorMock).not.toHaveBeenCalled();
  });

  it("loads the current user when signed in with a valid token", async () => {
    useAuthMock.mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      getToken: vi.fn().mockResolvedValue("token-123"),
    });
    fetchCurrentUserMock.mockResolvedValue({
      userId: "user_1",
      email: "a@example.com",
      plan: "base",
    });

    const { result } = renderHook(() => useCurrentUser());

    await waitFor(() => {
      expect(result.current.userId).toBe("user_1");
    });

    expect(result.current).toEqual({
      userId: "user_1",
      email: "a@example.com",
      plan: "base",
      isLoading: false,
    });
    expect(handleAppErrorMock).not.toHaveBeenCalled();
  });

  it("reports AUTH_SESSION_UNAVAILABLE when getToken() throws", async () => {
    useAuthMock.mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      getToken: vi.fn().mockRejectedValue(new Error("clerk unreachable")),
    });

    renderHook(() => useCurrentUser());

    await waitFor(() => {
      expect(handleAppErrorMock).toHaveBeenCalledTimes(1);
    });

    const [error, options] = handleAppErrorMock.mock.calls[0];
    expect(error).toMatchObject({ code: ERROR_CODES.AUTH_SESSION_UNAVAILABLE });
    expect(options).toEqual({
      showToast: false,
      fallbackTitle: "Unable to load your account",
    });
    expect(fetchCurrentUserMock).not.toHaveBeenCalled();
  });

  it("reports AUTH_SESSION_UNAVAILABLE when getToken() resolves to null", async () => {
    useAuthMock.mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      getToken: vi.fn().mockResolvedValue(null),
    });

    renderHook(() => useCurrentUser());

    await waitFor(() => {
      expect(handleAppErrorMock).toHaveBeenCalledTimes(1);
    });

    const [error] = handleAppErrorMock.mock.calls[0];
    expect(error).toMatchObject({ code: ERROR_CODES.AUTH_SESSION_UNAVAILABLE });
    expect(fetchCurrentUserMock).not.toHaveBeenCalled();
  });

  it("reports ACCOUNT_FETCH_FAILED when GET /users/me fails", async () => {
    useAuthMock.mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      getToken: vi.fn().mockResolvedValue("token-123"),
    });
    fetchCurrentUserMock.mockRejectedValue(
      new Error("Failed to load current user (status 500)")
    );

    const { result } = renderHook(() => useCurrentUser());

    await waitFor(() => {
      expect(handleAppErrorMock).toHaveBeenCalledTimes(1);
    });

    const [error, options] = handleAppErrorMock.mock.calls[0];
    expect(error).toMatchObject({ code: ERROR_CODES.ACCOUNT_FETCH_FAILED });
    expect(options).toEqual({
      showToast: false,
      fallbackTitle: "Unable to load your account",
    });
    expect(result.current.isLoading).toBe(false);
  });
});
