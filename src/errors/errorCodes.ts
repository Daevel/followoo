export const ERROR_CODES = {
  INVALID_ZIP_FILE: "INVALID_ZIP_FILE",
  INVALID_INSTAGRAM_EXPORT: "INVALID_INSTAGRAM_EXPORT",
  UNSUPPORTED_EXPORT_FORMAT: "UNSUPPORTED_EXPORT_FORMAT",
  MISSING_REQUIRED_DATA: "MISSING_REQUIRED_DATA",
  RESULTS_NOT_AVAILABLE: "RESULTS_NOT_AVAILABLE",
  // Account/identity (Task 5 v3.0.0): mirrors the backend's AUTH_TOKEN_*
  // naming (backend/app/auth/clerk.py) so the two layers stay easy to
  // correlate in Sentry, even though frontend and backend keep separate
  // error registries.
  AUTH_SESSION_UNAVAILABLE: "AUTH_SESSION_UNAVAILABLE",
  ACCOUNT_FETCH_FAILED: "ACCOUNT_FETCH_FAILED",
  // Encrypted history sync (v3.1.0 Task 1): network/server failures only.
  // A wrong passphrase or recovery code during unwrap is a normal, expected
  // UI validation outcome, not an AppError - see
  // src/features/sync/crypto/wrapping.ts's MasterKeyUnwrapError.
  SYNC_ACTIVATION_FAILED: "SYNC_ACTIVATION_FAILED",
  SYNC_CREDENTIALS_FETCH_FAILED: "SYNC_CREDENTIALS_FETCH_FAILED",
  SYNC_PASSPHRASE_ROTATION_FAILED: "SYNC_PASSPHRASE_ROTATION_FAILED",
  // Encrypted history (v3.1.0 Task 2): network/server failures for saving
  // and reading snapshots. A failed decrypt is different from Task 1's
  // wrong-passphrase case: the master key is already unlocked and correct
  // for this session, so a decrypt failure here means the stored data
  // itself is wrong - a real error to report, not UI validation.
  HISTORY_SNAPSHOT_SAVE_FAILED: "HISTORY_SNAPSHOT_SAVE_FAILED",
  HISTORY_LIST_FETCH_FAILED: "HISTORY_LIST_FETCH_FAILED",
  HISTORY_SNAPSHOT_FETCH_FAILED: "HISTORY_SNAPSHOT_FETCH_FAILED",
  HISTORY_SNAPSHOT_DECRYPT_FAILED: "HISTORY_SNAPSHOT_DECRYPT_FAILED",
  HISTORY_SNAPSHOT_DELETE_FAILED: "HISTORY_SNAPSHOT_DELETE_FAILED",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
} as const;

export type AppErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
