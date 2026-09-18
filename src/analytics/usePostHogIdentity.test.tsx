import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { usePostHogIdentity } from "./usePostHogIdentity";

const useAuthMock = vi.fn();

vi.mock("@clerk/react", () => ({
  useAuth: () => useAuthMock(),
}));

vi.mock("./posthogInit", () => ({
  initializePostHog: vi.fn().mockResolvedValue(undefined),
}));

function stubPostHog() {
  const identify = vi.fn();
  const reset = vi.fn();

  window.posthog = {
    identify,
    reset,
    // biome-ignore lint/suspicious/noExplicitAny: minimal stub of the real PostHog client for this test only.
  } as any;

  return { identify, reset };
}

async function flush() {
  await act(async () => {
    await Promise.resolve();
  });
}

afterEach(() => {
  window.posthog = undefined;
  vi.clearAllMocks();
});

describe("usePostHogIdentity", () => {
  it("does nothing while Clerk auth is still loading", async () => {
    const { identify, reset } = stubPostHog();
    useAuthMock.mockReturnValue({
      isLoaded: false,
      isSignedIn: false,
      userId: null,
    });

    renderHook(() => usePostHogIdentity());
    await flush();

    expect(identify).not.toHaveBeenCalled();
    expect(reset).not.toHaveBeenCalled();
  });

  it("calls identify(userId) once the user is signed in", async () => {
    const { identify } = stubPostHog();
    useAuthMock.mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      userId: "user_123",
    });

    renderHook(() => usePostHogIdentity());
    await flush();

    expect(identify).toHaveBeenCalledTimes(1);
    expect(identify).toHaveBeenCalledWith("user_123");
  });

  it("does not call identify again on re-render with the same userId", async () => {
    const { identify } = stubPostHog();
    useAuthMock.mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      userId: "user_123",
    });

    const { rerender } = renderHook(() => usePostHogIdentity());
    await flush();
    rerender();
    await flush();

    expect(identify).toHaveBeenCalledTimes(1);
  });

  it("does not call reset when the user was never signed in", async () => {
    const { reset } = stubPostHog();
    useAuthMock.mockReturnValue({
      isLoaded: true,
      isSignedIn: false,
      userId: null,
    });

    renderHook(() => usePostHogIdentity());
    await flush();

    expect(reset).not.toHaveBeenCalled();
  });

  it("calls reset() exactly on the signed-in -> signed-out transition, and identifies a new user afterwards without re-identifying the old one", async () => {
    const { identify, reset } = stubPostHog();
    useAuthMock.mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      userId: "user_1",
    });

    const { rerender } = renderHook(() => usePostHogIdentity());
    await flush();
    expect(identify).toHaveBeenCalledTimes(1);
    expect(reset).not.toHaveBeenCalled();

    useAuthMock.mockReturnValue({
      isLoaded: true,
      isSignedIn: false,
      userId: null,
    });
    rerender();
    await flush();
    expect(reset).toHaveBeenCalledTimes(1);

    useAuthMock.mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      userId: "user_2",
    });
    rerender();
    await flush();

    expect(identify).toHaveBeenNthCalledWith(1, "user_1");
    expect(identify).toHaveBeenNthCalledWith(2, "user_2");
    expect(identify).toHaveBeenCalledTimes(2);
    expect(reset).toHaveBeenCalledTimes(1);
  });
});
