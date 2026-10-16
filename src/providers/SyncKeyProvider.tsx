import { useAuth } from "@clerk/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useFeatureFlag } from "@/analytics";
import { AppError, ERROR_CODES, handleAppError } from "@/errors";
import { SYNC_FEATURE_FLAG_KEY } from "@/features/sync/constants";
import {
  MasterKeyUnwrapError,
  unwrapMasterKey,
  wrapMasterKey,
} from "@/features/sync/crypto";
import {
  fetchSyncCredentials,
  rotateSyncPassphrase,
  type SyncCredentials,
} from "@/features/sync/services/syncService";

export type SyncKeyStatus =
  | "checking"
  | "inactive"
  | "locked"
  | "unlocked"
  | "unavailable";

type ActiveSyncCredentials = Extract<SyncCredentials, { active: true }>;

type SyncKeyContextValue = {
  status: SyncKeyStatus;
  masterKey: Uint8Array<ArrayBuffer> | null;
  /** Set only once an unlock actually happened via a lost-passphrase recovery-code unlock - lets the UI offer "set a new passphrase". */
  unlockedVia: "passphrase" | "recovery" | null;
  unlockWithPassphrase: (passphrase: string) => Promise<boolean>;
  unlockWithRecoveryCode: (recoveryCode: string) => Promise<boolean>;
  setNewPassphrase: (newPassphrase: string) => Promise<boolean>;
  /** Called by SyncActivationWizard right after a successful first-time activation - the master key was just generated, no need to re-unlock it. */
  setUnlockedAfterActivation: (masterKey: Uint8Array<ArrayBuffer>) => void;
};

const SyncKeyContext = createContext<SyncKeyContextValue | null>(null);

type SyncKeyProviderProps = {
  children: React.ReactNode;
};

export function SyncKeyProvider({ children }: SyncKeyProviderProps) {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const isSyncEnabled = useFeatureFlag(SYNC_FEATURE_FLAG_KEY, false);

  const [status, setStatus] = useState<SyncKeyStatus>("checking");
  const [credentials, setCredentials] = useState<ActiveSyncCredentials | null>(
    null
  );
  const [masterKey, setMasterKey] = useState<Uint8Array<ArrayBuffer> | null>(
    null
  );
  const [unlockedVia, setUnlockedVia] = useState<
    "passphrase" | "recovery" | null
  >(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn || !isSyncEnabled) {
      setStatus("inactive");
      setCredentials(null);
      setMasterKey(null);
      setUnlockedVia(null);
      return;
    }

    let isMounted = true;
    setStatus("checking");

    (async () => {
      try {
        let token: string | null;

        try {
          token = await getToken();
        } catch (error) {
          throw new AppError({
            code: ERROR_CODES.AUTH_SESSION_UNAVAILABLE,
            message: "Clerk failed to provide a session token",
            userMessage: "We couldn't verify your session.",
            details: error,
          });
        }

        if (!token) {
          throw new AppError({
            code: ERROR_CODES.AUTH_SESSION_UNAVAILABLE,
            message: "Clerk returned no session token",
            userMessage: "We couldn't verify your session.",
          });
        }

        let result: SyncCredentials;

        try {
          result = await fetchSyncCredentials(token);
        } catch (error) {
          throw new AppError({
            code: ERROR_CODES.SYNC_CREDENTIALS_FETCH_FAILED,
            message: "Failed to load sync credentials",
            userMessage: "We couldn't check your encrypted history status.",
            details: error,
          });
        }

        if (!isMounted) return;

        if (!result.active) {
          setStatus("inactive");
          setCredentials(null);
          return;
        }

        setCredentials(result);
        setStatus("locked");
      } catch (error) {
        if (!isMounted) return;

        handleAppError(error, {
          showToast: false,
          fallbackTitle: "Unable to check encrypted history status",
        });
        setStatus("unavailable");
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [isLoaded, isSignedIn, isSyncEnabled, getToken]);

  const unlockWithPassphrase = useCallback(
    async (passphrase: string): Promise<boolean> => {
      if (!credentials) return false;

      try {
        const key = await unwrapMasterKey(
          {
            wrappedMasterKey: credentials.wrappedMasterKeyPassphrase,
            kdfSalt: credentials.kdfSaltPassphrase,
            kdfParams: credentials.kdfParamsPassphrase,
          },
          passphrase
        );

        setMasterKey(key);
        setUnlockedVia("passphrase");
        setStatus("unlocked");
        return true;
      } catch (error) {
        if (error instanceof MasterKeyUnwrapError) {
          return false;
        }

        throw error;
      }
    },
    [credentials]
  );

  const unlockWithRecoveryCode = useCallback(
    async (recoveryCode: string): Promise<boolean> => {
      if (!credentials) return false;

      try {
        const key = await unwrapMasterKey(
          {
            wrappedMasterKey: credentials.wrappedMasterKeyRecovery,
            kdfSalt: credentials.kdfSaltRecovery,
            kdfParams: credentials.kdfParamsRecovery,
          },
          recoveryCode
        );

        setMasterKey(key);
        setUnlockedVia("recovery");
        setStatus("unlocked");
        return true;
      } catch (error) {
        if (error instanceof MasterKeyUnwrapError) {
          return false;
        }

        throw error;
      }
    },
    [credentials]
  );

  const setNewPassphrase = useCallback(
    async (newPassphrase: string): Promise<boolean> => {
      if (!masterKey) return false;

      try {
        let token: string | null;

        try {
          token = await getToken();
        } catch (error) {
          throw new AppError({
            code: ERROR_CODES.AUTH_SESSION_UNAVAILABLE,
            message: "Clerk failed to provide a session token",
            userMessage:
              "We couldn't verify your session. Please sign in again.",
            details: error,
          });
        }

        if (!token) {
          throw new AppError({
            code: ERROR_CODES.AUTH_SESSION_UNAVAILABLE,
            message: "Clerk returned no session token",
            userMessage:
              "We couldn't verify your session. Please sign in again.",
          });
        }

        const newWrap = await wrapMasterKey(masterKey, newPassphrase);

        try {
          await rotateSyncPassphrase(token, {
            wrappedMasterKeyPassphrase: newWrap.wrappedMasterKey,
            kdfSaltPassphrase: newWrap.kdfSalt,
            kdfParamsPassphrase: newWrap.kdfParams,
          });
        } catch (error) {
          throw new AppError({
            code: ERROR_CODES.SYNC_PASSPHRASE_ROTATION_FAILED,
            message: "Failed to rotate sync passphrase",
            userMessage:
              "We couldn't set your new passphrase right now. Please try again.",
            details: error,
          });
        }

        setUnlockedVia("passphrase");
        return true;
      } catch (error) {
        handleAppError(error, {
          fallbackTitle: "Unable to set a new passphrase",
        });
        return false;
      }
    },
    [masterKey, getToken]
  );

  const setUnlockedAfterActivation = useCallback(
    (key: Uint8Array<ArrayBuffer>) => {
      setMasterKey(key);
      setUnlockedVia("passphrase");
      setStatus("unlocked");
    },
    []
  );

  const value = useMemo<SyncKeyContextValue>(
    () => ({
      status,
      masterKey,
      unlockedVia,
      unlockWithPassphrase,
      unlockWithRecoveryCode,
      setNewPassphrase,
      setUnlockedAfterActivation,
    }),
    [
      status,
      masterKey,
      unlockedVia,
      unlockWithPassphrase,
      unlockWithRecoveryCode,
      setNewPassphrase,
      setUnlockedAfterActivation,
    ]
  );

  return (
    <SyncKeyContext.Provider value={value}>{children}</SyncKeyContext.Provider>
  );
}

export function useSyncKey(): SyncKeyContextValue {
  const context = useContext(SyncKeyContext);

  if (!context) {
    throw new Error("useSyncKey must be used within a SyncKeyProvider");
  }

  return context;
}
