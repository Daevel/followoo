import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createSnapshot,
  deleteSnapshot,
  getSnapshot,
  listSnapshots,
} from "./historyService";

vi.mock("@/lib/api", () => ({
  getApiUrl: (path: string) => `https://api.test${path}`,
}));

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("createSnapshot", () => {
  it("sends only the encrypted blob and iv, never plaintext", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);

    await createSnapshot("token-123", {
      encryptedBlob: "ciphertext",
      iv: "iv-value",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.test/snapshots",
      expect.objectContaining({
        method: "POST",
        headers: {
          Authorization: "Bearer token-123",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          encrypted_blob: "ciphertext",
          iv: "iv-value",
        }),
      })
    );
  });

  it("throws when the response is not ok", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 500 }))
    );

    await expect(
      createSnapshot("token-123", { encryptedBlob: "c", iv: "i" })
    ).rejects.toThrow();
  });
});

describe("listSnapshots", () => {
  it("maps the response to camelCase and sends the bearer token", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify([
          { id: "1", created_at: "2026-10-01T00:00:00Z" },
          { id: "2", created_at: "2026-10-02T00:00:00Z" },
        ]),
        { status: 200 }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const items = await listSnapshots("token-123");

    expect(items).toEqual([
      { id: "1", createdAt: "2026-10-01T00:00:00Z" },
      { id: "2", createdAt: "2026-10-02T00:00:00Z" },
    ]);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.test/snapshots",
      expect.objectContaining({
        headers: { Authorization: "Bearer token-123" },
      })
    );
  });

  it("appends limit/offset as query params when given", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify([]), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await listSnapshots("token-123", { limit: 10, offset: 5 });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.test/snapshots?limit=10&offset=5",
      expect.anything()
    );
  });

  it("throws when the response is not ok", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 500 }))
    );

    await expect(listSnapshots("token-123")).rejects.toThrow();
  });
});

describe("getSnapshot", () => {
  it("maps the response to camelCase, including the encrypted blob and iv", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          id: "1",
          created_at: "2026-10-01T00:00:00Z",
          encrypted_blob: "ciphertext",
          iv: "iv-value",
        }),
        { status: 200 }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const snapshot = await getSnapshot("token-123", "1");

    expect(snapshot).toEqual({
      id: "1",
      createdAt: "2026-10-01T00:00:00Z",
      encryptedBlob: "ciphertext",
      iv: "iv-value",
    });
  });

  it("throws when the response is not ok (e.g. 404)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 404 }))
    );

    await expect(getSnapshot("token-123", "missing")).rejects.toThrow();
  });
});

describe("deleteSnapshot", () => {
  it("sends a DELETE request with the bearer token", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);

    await deleteSnapshot("token-123", "1");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.test/snapshots/1",
      expect.objectContaining({
        method: "DELETE",
        headers: { Authorization: "Bearer token-123" },
      })
    );
  });

  it("throws when the response is not ok", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 404 }))
    );

    await expect(deleteSnapshot("token-123", "missing")).rejects.toThrow();
  });
});
