import { useAuth } from "@clerk/react";
import { useCallback, useEffect, useState } from "react";
import { AppError, ERROR_CODES, handleAppError } from "@/errors";
import {
  deleteSnapshot,
  listSnapshots,
  type SnapshotListItem,
} from "../services/historyService";

export type HistoryListStatus = "loading" | "loaded" | "error";

/**
 * Fetches and manages the list of saved history entries (v3.1.0 Task 2).
 * Only ever holds `{id, createdAt}` pairs - the encrypted blob/iv for a
 * single entry is fetched (and decrypted in memory) separately, on
 * demand, by whatever opens that entry.
 */
export function useHistorySnapshots() {
  const { getToken } = useAuth();
  const [items, setItems] = useState<SnapshotListItem[]>([]);
  const [status, setStatus] = useState<HistoryListStatus>("loading");

  const refresh = useCallback(async () => {
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

      let list: SnapshotListItem[];

      try {
        list = await listSnapshots(token);
      } catch (error) {
        throw new AppError({
          code: ERROR_CODES.HISTORY_LIST_FETCH_FAILED,
          message: "Failed to list history snapshots",
          userMessage: "We couldn't load your history right now.",
          details: error,
        });
      }

      setItems(list);
      setStatus("loaded");
    } catch (error) {
      handleAppError(error, { fallbackTitle: "Unable to load your history" });
      setStatus("error");
    }
  }, [getToken]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const removeSnapshot = useCallback(
    async (id: string): Promise<boolean> => {
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

        try {
          await deleteSnapshot(token, id);
        } catch (error) {
          throw new AppError({
            code: ERROR_CODES.HISTORY_SNAPSHOT_DELETE_FAILED,
            message: "Failed to delete history snapshot",
            userMessage: "We couldn't delete this entry right now.",
            details: error,
          });
        }

        setItems((previous) => previous.filter((item) => item.id !== id));
        return true;
      } catch (error) {
        handleAppError(error, { fallbackTitle: "Unable to delete this entry" });
        return false;
      }
    },
    [getToken]
  );

  return { items, status, refresh, removeSnapshot };
}
