// Single source of truth for the flag gating the whole sync/history
// surface (activation, unlock, and v3.1.0 Task 2's history page) - one
// flag, not one per screen, since they are the same feature from the
// user's point of view. Default false: history review didn't exist until
// Task 2, so this stays invisible to real users until explicitly turned
// on per-user/cohort in PostHog.
export const SYNC_FEATURE_FLAG_KEY = "followoo-encrypted-history-sync-enabled";
