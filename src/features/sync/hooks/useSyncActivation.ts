import { useAuth } from "@clerk/react";
import { useCallback, useState } from "react";
import { AppError, ERROR_CODES, handleAppError } from "@/errors";
import { generateMasterKey, wrapMasterKey } from "@/features/sync/crypto";
import { activateSync } from "@/features/sync/services/syncService";

export type SyncActivationStatus = "idle" | "activating" | "success" | "error";

/**
 * Orchestrates the activation side-effect only: given a passphrase and a
 * recovery code the wizard already generated and displayed (see
 * SyncActivationWizard), this generates the master key, wraps it with
 * both secrets, and calls POST /sync/activate. Network/server failures
 * become a `SYNC_ACTIVATION_FAILED` AppError - a wrong passphrase or
 * recovery code is not a failure mode here at all, since both secrets
 * are freshly chosen/generated in this same flow, never re-entered
 * against an existing wrap.
 */
export function useSyncActivation() {
  const { getToken } = useAuth();
  const [status, setStatus] = useState<SyncActivationStatus>("idle");

  const activate = useCallback(
    async (passphrase: string, recoveryCode: string): Promise<boolean> => {
      setStatus("activating");

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

        const masterKey = generateMasterKey();

        const [passphraseWrap, recoveryWrap] = await Promise.all([
          wrapMasterKey(masterKey, passphrase),
          wrapMasterKey(masterKey, recoveryCode),
        ]);

        try {
          await activateSync(token, {
            wrappedMasterKeyPassphrase: passphraseWrap.wrappedMasterKey,
            kdfSaltPassphrase: passphraseWrap.kdfSalt,
            kdfParamsPassphrase: passphraseWrap.kdfParams,
            wrappedMasterKeyRecovery: recoveryWrap.wrappedMasterKey,
            kdfSaltRecovery: recoveryWrap.kdfSalt,
            kdfParamsRecovery: recoveryWrap.kdfParams,
          });
        } catch (error) {
          throw new AppError({
            code: ERROR_CODES.SYNC_ACTIVATION_FAILED,
            message: "Failed to activate encrypted history sync",
            userMessage:
              "We couldn't activate encrypted history right now. Please try again.",
            details: error,
          });
        }

        setStatus("success");
        return true;
      } catch (error) {
        handleAppError(error, {
          fallbackTitle: "Unable to activate encrypted history",
        });
        setStatus("error");
        return false;
      }
    },
    [getToken]
  );

  const reset = useCallback(() => setStatus("idle"), []);

  return { status, activate, reset };
}
