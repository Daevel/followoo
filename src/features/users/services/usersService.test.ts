import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchCurrentUser, logUsageEvent } from "./usersService";

vi.mock("@/lib/api", () => ({
  getApiUrl: (path: string) => `https://api.test${path}`,
}));

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchCurrentUser", () => {
  it("sends the bearer token and maps the response to camelCase", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          user_id: "user_1",
          email: "a@example.com",
          plan: "base",
        }),
        { status: 200 }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const user = await fetchCurrentUser("token-123");

    expect(user).toEqual({
      userId: "user_1",
      email: "a@example.com",
      plan: "base",
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.test/users/me",
      expect.objectContaining({
        headers: { Authorization: "Bearer token-123" },
      })
    );
  });

  it("throws when the response is not ok", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 401 }))
    );

    await expect(fetchCurrentUser("bad-token")).rejects.toThrow();
  });
});

describe("logUsageEvent", () => {
  it("posts the event type only, never export/relationship data", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);

    await logUsageEvent("token-123", "analysis_run");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.test/usage-events",
      expect.objectContaining({
        method: "POST",
        headers: {
          Authorization: "Bearer token-123",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ event_type: "analysis_run" }),
      })
    );
  });

  it("throws when the response is not ok", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 500 }))
    );

    await expect(logUsageEvent("token-123", "analysis_run")).rejects.toThrow();
  });
});
