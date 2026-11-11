import { useAuth } from "@clerk/react";
import { useCallback, useState } from "react";
import { AppError, ERROR_CODES, handleAppError } from "@/errors";
import { decryptWithMasterKey } from "@/features/sync/crypto";
import type { InstagramAnalysisResult } from "@/types/instagram.types";
import { getSnapshot } from "../services/historyService";

export type OpenSnapshotStatus = "idle" | "loading" | "error";

/**
 * Fetches one history entry and decrypts it in memory with the already
 * unlocked master key. Unlike Task 1's wrong-passphrase case, a decrypt
 * (or JSON parse) failure here is a real error, not expected validation:
 * the master key is already known-correct for this session, so a
 * failure means the stored data itself is wrong.
 */
export function useOpenSnapshot() {
  const { getToken } = useAuth();
  const [status, setStatus] = useState<OpenSnapshotStatus>("idle");

  const openSnapshot = useCallback(
    async (
      id: string,
      masterKey: Uint8Array<ArrayBuffer>
    ): Promise<InstagramAnalysisResult | null> => {
      setStatus("loading");

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

        let snapshot: Awaited<ReturnType<typeof getSnapshot>>;

        try {
          snapshot = await getSnapshot(token, id);
        } catch (error) {
          throw new AppError({
            code: ERROR_CODES.HISTORY_SNAPSHOT_FETCH_FAILED,
            message: "Failed to fetch history snapshot",
            userMessage: "We couldn't load this history entry right now.",
            details: error,
          });
        }

        let analysis: InstagramAnalysisResult;

        try {
          const plaintext = await decryptWithMasterKey(masterKey, {
            ciphertext: snapshot.encryptedBlob,
            iv: snapshot.iv,
          });
          analysis = JSON.parse(plaintext) as InstagramAnalysisResult;
        } catch (error) {
          throw new AppError({
            code: ERROR_CODES.HISTORY_SNAPSHOT_DECRYPT_FAILED,
            message: "Failed to decrypt history snapshot",
            userMessage:
              "We couldn't open this history entry - it may be corrupted.",
            details: error,
          });
        }

        setStatus("idle");
        return analysis;
      } catch (error) {
        handleAppError(error, {
          fallbackTitle: "Unable to open this history entry",
        });
        setStatus("error");
        return null;
      }
    },
    [getToken]
  );

  return { openSnapshot, status };
}
