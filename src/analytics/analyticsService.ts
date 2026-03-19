import type { AnalyticsEventName } from "./analyticsEvents";

export type AnalyticsProperties = Record<
  string,
  string | number | boolean | null | undefined
>;

class AnalyticsService {
  track(eventName: AnalyticsEventName, properties?: AnalyticsProperties) {
    if (typeof window === "undefined") return;
    if (typeof window.plausible !== "function") return;

    window.plausible(eventName, {
      props: properties,
    });
  }
}

export const analyticsService = new AnalyticsService();