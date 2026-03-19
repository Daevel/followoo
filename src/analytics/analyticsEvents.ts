export const ANALYTICS_EVENTS = {
  ZIP_UPLOADED: "zip_uploaded",
  ANALYSIS_STARTED: "analysis_started",
  ANALYSIS_COMPLETED: "analysis_completed",
  RESULTS_TAB_CHANGED: "results_tab_changed",
  RESULTS_SEARCH_USED: "results_search_used",
  APP_ERROR: "app_error",
} as const;

export type AnalyticsEventName =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];