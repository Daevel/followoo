import { afterEach, describe, expect, it, vi } from "vitest";
import {
  activateSync,
  fetchSyncCredentials,
  rotateSyncPassphrase,
} from "./syncService";

vi.mock("@/lib/api", () => ({
  getApiUrl: (path: string) => `https://api.test${path}`,
}));

afterEach(() => {
  vi.unstubAllGlobals();
});

const kdfParams = {
  algorithm: "PBKDF2",
  hash: "SHA-256",
  iterations: 600_000,
  iv: "aXY=",
};

describe("fetchSyncCredentials", () => {
  it("maps an inactive response to { active: false }", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify({ active: false }), { status: 200 })
        )
    );

    const credentials = await fetchSyncCredentials("token-123");

    expect(credentials).toEqual({ active: false });
  });

  it("maps an active response to camelCase, sending the bearer token", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          active: true,
          wrapped_master_key_passphrase: "wrapped-passphrase",
          kdf_salt_passphrase: "salt-passphrase",
          kdf_params_passphrase: kdfParams,
          wrapped_master_key_recovery: "wrapped-recovery",
          kdf_salt_recovery: "salt-recovery",
          kdf_params_recovery: kdfParams,
        }),
        { status: 200 }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const credentials = await fetchSyncCredentials("token-123");

    expect(credentials).toEqual({
      active: true,
      wrappedMasterKeyPassphrase: "wrapped-passphrase",
      kdfSaltPassphrase: "salt-passphrase",
      kdfParamsPassphrase: kdfParams,
      wrappedMasterKeyRecovery: "wrapped-recovery",
      kdfSaltRecovery: "salt-recovery",
      kdfParamsRecovery: kdfParams,
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.test/sync/credentials",
      expect.objectContaining({
        headers: { Authorization: "Bearer token-123" },
      })
    );
  });

  it("throws when the response is not ok", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 500 }))
    );

    await expect(fetchSyncCredentials("token-123")).rejects.toThrow();
  });
});

describe("activateSync", () => {
  it("sends the wrapped keys only, never plaintext secrets", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);

    await activateSync("token-123", {
      wrappedMasterKeyPassphrase: "wrapped-passphrase",
      kdfSaltPassphrase: "salt-passphrase",
      kdfParamsPassphrase: kdfParams,
      wrappedMasterKeyRecovery: "wrapped-recovery",
      kdfSaltRecovery: "salt-recovery",
      kdfParamsRecovery: kdfParams,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.test/sync/activate",
      expect.objectContaining({
        method: "POST",
        headers: {
          Authorization: "Bearer token-123",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wrapped_master_key_passphrase: "wrapped-passphrase",
          kdf_salt_passphrase: "salt-passphrase",
          kdf_params_passphrase: kdfParams,
          wrapped_master_key_recovery: "wrapped-recovery",
          kdf_salt_recovery: "salt-recovery",
          kdf_params_recovery: kdfParams,
        }),
      })
    );
  });

  it("throws when the response is not ok (e.g. 409 already active)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 409 }))
    );

    await expect(
      activateSync("token-123", {
        wrappedMasterKeyPassphrase: "wrapped-passphrase",
        kdfSaltPassphrase: "salt-passphrase",
        kdfParamsPassphrase: kdfParams,
        wrappedMasterKeyRecovery: "wrapped-recovery",
        kdfSaltRecovery: "salt-recovery",
        kdfParamsRecovery: kdfParams,
      })
    ).rejects.toThrow();
  });
});

describe("rotateSyncPassphrase", () => {
  it("sends only the new passphrase wrap", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await rotateSyncPassphrase("token-123", {
      wrappedMasterKeyPassphrase: "wrapped-passphrase-v2",
      kdfSaltPassphrase: "salt-passphrase-v2",
      kdfParamsPassphrase: kdfParams,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.test/sync/rotate-passphrase",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          wrapped_master_key_passphrase: "wrapped-passphrase-v2",
          kdf_salt_passphrase: "salt-passphrase-v2",
          kdf_params_passphrase: kdfParams,
        }),
      })
    );
  });

  it("throws when the response is not ok (e.g. 404 not active)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 404 }))
    );

    await expect(
      rotateSyncPassphrase("token-123", {
        wrappedMasterKeyPassphrase: "wrapped-passphrase-v2",
        kdfSaltPassphrase: "salt-passphrase-v2",
        kdfParamsPassphrase: kdfParams,
      })
    ).rejects.toThrow();
  });
});
