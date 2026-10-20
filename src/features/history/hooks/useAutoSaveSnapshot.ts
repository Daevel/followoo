import { useAuth } from "@clerk/react";
import { useCallback } from "react";
import { AppError, ERROR_CODES, handleAppError } from "@/errors";
import { encryptWithMasterKey } from "@/features/sync/crypto";
import { useSyncKey } from "@/providers/SyncKeyProvider";
import type { InstagramAnalysisResult } from "@/types/instagram.types";
import { createSnapshot } from "../services/historyService";

/**
 * Automatic, fire-and-forget history saving (v3.1.0 Task 2): if the user
 * is signed in, has activated encrypted history, and has it unlocked for
 * this session, every completed analysis gets encrypted and saved without
 * any extra action from them - the consent already happened once, at
 * activation (see SyncKeyProvider, src/features/sync/).
 *
 * `saveSnapshot` returns immediately and never throws or blocks - call it
 * right after an analysis completes (see useInstagramExportAnalysis.ts)
 * without awaiting it. A failure is reported with `showToast: false`:
 * the user already has their result in front of them, and losing a
 * background save must never interrupt that, but it still needs to be
 * visible in Sentry if it starts failing systematically.
 */
/**
 * What `saveSnapshot` did: started saving in the background, skipped
 * because history is activated but locked, or skipped because history
 * doesn't apply (signed out, not activated, unavailable).
 */
export type SnapshotSaveOutcome = "saving" | "locked" | "skipped";

export function useAutoSaveSnapshot() {
  const { getToken, isSignedIn } = useAuth();
  const { status, masterKey } = useSyncKey();

  const saveSnapshot = useCallback(
    (analysis: InstagramAnalysisResult): SnapshotSaveOutcome => {
      if (!isSignedIn) return "skipped";
      // Activated but not unlocked this session: nothing is saved, and the
      // caller can offer "Unlock and save" (HistorySavePrompt).
      if (status === "locked") return "locked";
      if (status !== "unlocked" || !masterKey) return "skipped";

      void (async () => {
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

          const { ciphertext, iv } = await encryptWithMasterKey(
            masterKey,
            JSON.stringify(analysis)
          );

          try {
            await createSnapshot(token, { encryptedBlob: ciphertext, iv });
          } catch (error) {
            throw new AppError({
              code: ERROR_CODES.HISTORY_SNAPSHOT_SAVE_FAILED,
              message: "Failed to save history snapshot",
              userMessage: "We couldn't save this analysis to your history.",
              details: error,
            });
          }
        } catch (error) {
          handleAppError(error, {
            showToast: false,
            fallbackTitle: "Failed to save history snapshot",
          });
        }
      })();

      return "saving";
    },
    [isSignedIn, status, masterKey, getToken]
  );

  return { saveSnapshot };
}
