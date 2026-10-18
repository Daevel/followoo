import { useCallback, useState } from "react";
import {
  type AnalysisComparison,
  compareAnalysisSnapshots,
} from "@/features/relationship/services/analysisComparisonService";
import type { SnapshotListItem } from "../services/historyService";
import { useOpenSnapshot } from "./useOpenSnapshot";

export type SnapshotComparisonStatus = "idle" | "loading" | "ready" | "error";

/**
 * Fetches and decrypts two history entries, then diffs them. Reuses
 * useOpenSnapshot twice (two independent instances, so each has its own
 * loading/error state) rather than duplicating its fetch+decrypt logic -
 * each failure already surfaces its own AppError/toast exactly like
 * opening a single entry does. If either fetch/decrypt fails, this
 * returns `null` without ever building a partial comparison.
 */
export function useSnapshotComparison() {
  const { openSnapshot: openFirst } = useOpenSnapshot();
  const { openSnapshot: openSecond } = useOpenSnapshot();
  const [status, setStatus] = useState<SnapshotComparisonStatus>("idle");

  const compare = useCallback(
    async (
      a: SnapshotListItem,
      b: SnapshotListItem,
      masterKey: Uint8Array<ArrayBuffer>
    ): Promise<AnalysisComparison | null> => {
      setStatus("loading");

      const [analysisA, analysisB] = await Promise.all([
        openFirst(a.id, masterKey),
        openSecond(b.id, masterKey),
      ]);

      if (!analysisA || !analysisB) {
        setStatus("error");
        return null;
      }

      const comparison = compareAnalysisSnapshots(
        { createdAt: a.createdAt, analysis: analysisA },
        { createdAt: b.createdAt, analysis: analysisB }
      );

      setStatus("ready");
      return comparison;
    },
    [openFirst, openSecond]
  );

  return { status, compare };
}
