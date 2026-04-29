import posthog from "posthog-js";

let initialized = false;

export function initializePostHog() {
  if (initialized) return;

  const apiKey = import.meta.env.VITE_POSTHOG_API_KEY;
  const apiHost = import.meta.env.VITE_POSTHOG_API_HOST;

  if (!apiKey) {
    console.warn("Missing VITE_POSTHOG_API_KEY");
    return;
  }

  posthog.init(apiKey, {
    api_host: apiHost,
    capture_pageview: true,
    autocapture: false,
    disable_session_recording: true,
  });

  window.posthog = posthog;
  initialized = true;

  console.log("PostHog initialized");
}
