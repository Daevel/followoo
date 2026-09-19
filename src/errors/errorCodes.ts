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
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
} as const;

export type AppErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
