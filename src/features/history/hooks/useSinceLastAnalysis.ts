import { useAuth } from "@clerk/react";
import { useEffect, useState } from "react";
import { AppError, ERROR_CODES, handleAppError } from "@/errors";
import {
  type AnalysisComparison,
  compareAnalysisSnapshots,
} from "@/features/relationship/services/analysisComparisonService";
import { decryptWithMasterKey } from "@/features/sync/crypto";
import { useSyncKey } from "@/providers/SyncKeyProvider";
import type { InstagramAnalysisResult } from "@/types/instagram.types";
import { getSnapshot, listSnapshots } from "../services/historyService";

export type SinceLastAnalysis =
  | { status: "idle" | "loading" | "none" | "error" }
  | { status: "ready"; comparison: AnalysisComparison };

/** Saved entries to look through for one that isn't this same analysis. */
const MAX_ENTRIES_TO_CHECK = 5;

/**
 * Compares a fresh analysis with the last one saved in History, so the
 * results page can say who unfollowed the user since then with no extra
 * step. Runs only while History is unlocked (it waits for an unlock from
 * HistorySavePrompt), decrypts in memory like useOpenSnapshot, and never
 * blocks the results: a failure is reported without a toast and the
 * page simply shows no comparison.
 *
 * The fresh analysis is saved in the background at the same time, so the
 * newest entry may already be this very analysis: entries whose plaintext
 * equals it are skipped (the same export analyzed twice is skipped too,
 * which compares against the last *different* one).
 */
export function useSinceLastAnalysis(
  analysis: InstagramAnalysisResult,
  enabled: boolean
): SinceLastAnalysis {
  const { getToken } = useAuth();
  const { status, masterKey } = useSyncKey();
  const [result, setResult] = useState<SinceLastAnalysis>({ status: "idle" });

  useEffect(() => {
    if (!enabled || status !== "unlocked" || !masterKey) return;

    let isCurrent = true;
    setResult({ status: "loading" });

    async function findPrevious(key: Uint8Array<ArrayBuffer>) {
      const token = await getToken();

      if (!token) {
        throw new AppError({
          code: ERROR_CODES.AUTH_SESSION_UNAVAILABLE,
          message: "Clerk returned no session token",
          userMessage: "We couldn't verify your session.",
        });
      }

      const current = JSON.stringify(analysis);
      const entries = (await listSnapshots(token)).slice(
        0,
        MAX_ENTRIES_TO_CHECK
      );

      for (const entry of entries) {
        const snapshot = await getSnapshot(token, entry.id);
        const plaintext = await decryptWithMasterKey(key, {
          ciphertext: snapshot.encryptedBlob,
          iv: snapshot.iv,
        });

        if (plaintext === current) continue;

        return compareAnalysisSnapshots(
          {
            createdAt: entry.createdAt,
            analysis: JSON.parse(plaintext) as InstagramAnalysisResult,
          },
          { createdAt: new Date().toISOString(), analysis }
        );
      }

      return null;
    }

    findPrevious(masterKey)
      .then((comparison) => {
        if (!isCurrent) return;
        setResult(
          comparison ? { status: "ready", comparison } : { status: "none" }
        );
      })
      .catch((error) => {
        handleAppError(
          error instanceof AppError
            ? error
            : new AppError({
                code: ERROR_CODES.HISTORY_SNAPSHOT_FETCH_FAILED,
                message: "Failed to compare with the last saved analysis",
                userMessage: "We couldn't compare with your last analysis.",
                details: error,
              }),
          { showToast: false }
        );
        if (isCurrent) setResult({ status: "error" });
      });

    return () => {
      isCurrent = false;
    };
  }, [enabled, status, masterKey, analysis, getToken]);

  return result;
}
