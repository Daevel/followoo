import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ERROR_CODES } from "@/errors";
import { generateMasterKey, wrapMasterKey } from "@/features/sync/crypto";
import { SyncKeyProvider, useSyncKey } from "./SyncKeyProvider";

const useAuthMock = vi.fn();
const useFeatureFlagMock = vi.fn();
const handleAppErrorMock = vi.fn();
const fetchSyncCredentialsMock = vi.fn();
const rotateSyncPassphraseMock = vi.fn();

vi.mock("@clerk/react", () => ({
  useAuth: () => useAuthMock(),
}));

vi.mock("@/analytics", () => ({
  useFeatureFlag: (key: string, defaultValue: boolean) =>
    useFeatureFlagMock(key, defaultValue),
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
  fetchSyncCredentials: (...args: unknown[]) =>
    fetchSyncCredentialsMock(...args),
  rotateSyncPassphrase: (...args: unknown[]) =>
    rotateSyncPassphraseMock(...args),
}));

afterEach(() => {
  vi.clearAllMocks();
});

function renderSyncKey() {
  return renderHook(() => useSyncKey(), { wrapper: SyncKeyProvider });
}

describe("SyncKeyProvider", () => {
  it("is inactive when signed out, without fetching credentials", async () => {
    useAuthMock.mockReturnValue({
      isLoaded: true,
      isSignedIn: false,
      getToken: vi.fn(),
    });
    useFeatureFlagMock.mockReturnValue(true);

    const { result } = renderSyncKey();

    await waitFor(() => {
      expect(result.current.status).toBe("inactive");
    });
    expect(fetchSyncCredentialsMock).not.toHaveBeenCalled();
  });

  it("is inactive when signed in but the feature flag is off", async () => {
    useAuthMock.mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      getToken: vi.fn(),
    });
    useFeatureFlagMock.mockReturnValue(false);

    const { result } = renderSyncKey();

    await waitFor(() => {
      expect(result.current.status).toBe("inactive");
    });
    expect(fetchSyncCredentialsMock).not.toHaveBeenCalled();
  });

  it("is inactive when signed in, flagged in, but never activated", async () => {
    useAuthMock.mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      getToken: vi.fn().mockResolvedValue("token-123"),
    });
    useFeatureFlagMock.mockReturnValue(true);
    fetchSyncCredentialsMock.mockResolvedValue({ active: false });

    const { result } = renderSyncKey();

    await waitFor(() => {
      expect(result.current.status).toBe("inactive");
    });
  });

  it("is locked when active credentials exist for this session", async () => {
    useAuthMock.mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      getToken: vi.fn().mockResolvedValue("token-123"),
    });
    useFeatureFlagMock.mockReturnValue(true);
    fetchSyncCredentialsMock.mockResolvedValue({
      active: true,
      wrappedMasterKeyPassphrase: "w1",
      kdfSaltPassphrase: "s1",
      kdfParamsPassphrase: {
        algorithm: "PBKDF2",
        hash: "SHA-256",
        iterations: 1,
        iv: "iv1",
      },
      wrappedMasterKeyRecovery: "w2",
      kdfSaltRecovery: "s2",
      kdfParamsRecovery: {
        algorithm: "PBKDF2",
        hash: "SHA-256",
        iterations: 1,
        iv: "iv2",
      },
    });

    const { result } = renderSyncKey();

    await waitFor(() => {
      expect(result.current.status).toBe("locked");
    });
    expect(result.current.masterKey).toBeNull();
  });

  it("becomes unavailable and reports AUTH_SESSION_UNAVAILABLE when getToken() fails", async () => {
    useAuthMock.mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      getToken: vi.fn().mockRejectedValue(new Error("clerk down")),
    });
    useFeatureFlagMock.mockReturnValue(true);

    const { result } = renderSyncKey();

    await waitFor(() => {
      expect(result.current.status).toBe("unavailable");
    });
    const [error] = handleAppErrorMock.mock.calls[0];
    expect(error).toMatchObject({ code: ERROR_CODES.AUTH_SESSION_UNAVAILABLE });
  });

  it("becomes unavailable and reports SYNC_CREDENTIALS_FETCH_FAILED when the fetch fails", async () => {
    useAuthMock.mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      getToken: vi.fn().mockResolvedValue("token-123"),
    });
    useFeatureFlagMock.mockReturnValue(true);
    fetchSyncCredentialsMock.mockRejectedValue(new Error("status 500"));

    const { result } = renderSyncKey();

    await waitFor(() => {
      expect(result.current.status).toBe("unavailable");
    });
    const [error] = handleAppErrorMock.mock.calls[0];
    expect(error).toMatchObject({
      code: ERROR_CODES.SYNC_CREDENTIALS_FETCH_FAILED,
    });
  });

  describe("unlocking with real wrapped credentials", () => {
    async function setUpLockedSession() {
      const masterKey = generateMasterKey();
      const passphraseWrap = await wrapMasterKey(masterKey, "the-passphrase");
      const recoveryWrap = await wrapMasterKey(masterKey, "the-recovery-code");

      useAuthMock.mockReturnValue({
        isLoaded: true,
        isSignedIn: true,
        getToken: vi.fn().mockResolvedValue("token-123"),
      });
      useFeatureFlagMock.mockReturnValue(true);
      fetchSyncCredentialsMock.mockResolvedValue({
        active: true,
        wrappedMasterKeyPassphrase: passphraseWrap.wrappedMasterKey,
        kdfSaltPassphrase: passphraseWrap.kdfSalt,
        kdfParamsPassphrase: passphraseWrap.kdfParams,
        wrappedMasterKeyRecovery: recoveryWrap.wrappedMasterKey,
        kdfSaltRecovery: recoveryWrap.kdfSalt,
        kdfParamsRecovery: recoveryWrap.kdfParams,
      });

      const rendered = renderSyncKey();
      await waitFor(() => {
        expect(rendered.result.current.status).toBe("locked");
      });

      return { masterKey, ...rendered };
    }

    it("unlocks with the correct passphrase", async () => {
      const { masterKey, result } = await setUpLockedSession();

      let unlocked = false;
      await act(async () => {
        unlocked = await result.current.unlockWithPassphrase("the-passphrase");
      });

      expect(unlocked).toBe(true);
      expect(result.current.status).toBe("unlocked");
      expect(result.current.masterKey).toEqual(masterKey);
      expect(result.current.unlockedVia).toBe("passphrase");
    });

    it("stays locked, as a normal validation outcome, with the wrong passphrase", async () => {
      const { result } = await setUpLockedSession();

      let unlocked = true;
      await act(async () => {
        unlocked =
          await result.current.unlockWithPassphrase("wrong-passphrase");
      });

      expect(unlocked).toBe(false);
      expect(result.current.status).toBe("locked");
      expect(result.current.masterKey).toBeNull();
      expect(handleAppErrorMock).not.toHaveBeenCalled();
    });

    it("unlocks with the correct recovery code and marks unlockedVia as recovery", async () => {
      const { masterKey, result } = await setUpLockedSession();

      let unlocked = false;
      await act(async () => {
        unlocked =
          await result.current.unlockWithRecoveryCode("the-recovery-code");
      });

      expect(unlocked).toBe(true);
      expect(result.current.masterKey).toEqual(masterKey);
      expect(result.current.unlockedVia).toBe("recovery");
    });

    it("stays locked with the wrong recovery code", async () => {
      const { result } = await setUpLockedSession();

      let unlocked = true;
      await act(async () => {
        unlocked = await result.current.unlockWithRecoveryCode("wrong-code");
      });

      expect(unlocked).toBe(false);
      expect(result.current.status).toBe("locked");
    });

    it("rotates to a new passphrase after a recovery-code unlock", async () => {
      const { result } = await setUpLockedSession();

      await act(async () => {
        await result.current.unlockWithRecoveryCode("the-recovery-code");
      });
      expect(result.current.unlockedVia).toBe("recovery");

      rotateSyncPassphraseMock.mockResolvedValue(undefined);

      let rotated = false;
      await act(async () => {
        rotated = await result.current.setNewPassphrase(
          "a brand new passphrase"
        );
      });

      expect(rotated).toBe(true);
      expect(rotateSyncPassphraseMock).toHaveBeenCalledTimes(1);
      const [token, payload] = rotateSyncPassphraseMock.mock.calls[0];
      expect(token).toBe("token-123");
      expect(payload).not.toHaveProperty("newPassphrase");
      expect(payload.wrappedMasterKeyPassphrase).toBeTypeOf("string");
      expect(result.current.unlockedVia).toBe("passphrase");
    });

    it("reports SYNC_PASSPHRASE_ROTATION_FAILED when rotation fails", async () => {
      const { result } = await setUpLockedSession();

      await act(async () => {
        await result.current.unlockWithRecoveryCode("the-recovery-code");
      });

      rotateSyncPassphraseMock.mockRejectedValue(new Error("status 500"));

      let rotated = true;
      await act(async () => {
        rotated = await result.current.setNewPassphrase(
          "a brand new passphrase"
        );
      });

      expect(rotated).toBe(false);
      const [error] = handleAppErrorMock.mock.calls[0];
      expect(error).toMatchObject({
        code: ERROR_CODES.SYNC_PASSPHRASE_ROTATION_FAILED,
      });
    });
  });

  it("setUnlockedAfterActivation marks the session unlocked with the given key", async () => {
    useAuthMock.mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      getToken: vi.fn().mockResolvedValue("token-123"),
    });
    useFeatureFlagMock.mockReturnValue(true);
    fetchSyncCredentialsMock.mockResolvedValue({ active: false });

    const { result } = renderSyncKey();
    await waitFor(() => {
      expect(result.current.status).toBe("inactive");
    });

    const freshMasterKey = generateMasterKey();
    act(() => {
      result.current.setUnlockedAfterActivation(freshMasterKey);
    });

    expect(result.current.status).toBe("unlocked");
    expect(result.current.masterKey).toEqual(freshMasterKey);
    expect(result.current.unlockedVia).toBe("passphrase");
  });
});
