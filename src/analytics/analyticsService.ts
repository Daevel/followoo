import type { AnalyticsEventName } from "./analyticsEvents";

export type AnalyticsProperties = Record<
  string,
  string | number | boolean | null | undefined
>;

class AnalyticsService {
  track(eventName: AnalyticsEventName, properties?: AnalyticsProperties) {
    if (typeof window === "undefined") return;
    if (typeof window.posthog === "undefined") return;

    window.posthog.capture(eventName, properties);
  }
}

export const analyticsService = new AnalyticsService();
