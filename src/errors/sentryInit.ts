import type { AppError } from "./AppError";

let initialized = false;
let sentryModule: typeof import("@sentry/react") | null = null;

// Keys that must never leave the browser, even redacted-in-place inside a
// nested object. Mirrors the same non-negotiable list documented in
// .opencode/skills/project-context/SKILL.md and enforced server-side in
// backend/app/core/sentry.py: Instagram export content, usernames,
// follower/following lists, and relationship analysis results.
const SENSITIVE_KEY_PATTERN =
  /instagram|follower|following|username|relationship|export|zip|blocked|restricted|closefriend|unfollow|persona/i;

function redactValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    // Follower/following lists are large arrays of usernames/objects;
    // never forward array contents to Sentry, only their length.
    return `[redacted array(${value.length})]`;
  }

  if (value && typeof value === "object") {
    return redactObject(value as Record<string, unknown>);
  }

  return value;
}

function redactObject(input: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(input)) {
    result[key] = SENSITIVE_KEY_PATTERN.test(key)
      ? "[redacted]"
      : redactValue(value);
  }

  return result;
}

/**
 * Defensive scrubbing for what we can reach structurally (request data,
 * extra context, custom contexts). This cannot rewrite a free-text
 * exception message a future bug might accidentally build from private
 * data - the real guardrail for that is only ever raising AppError-style
 * errors with static, developer-authored messages (see toAppError.ts and
 * the instagram-export/relationship services), never interpolating
 * usernames or export content into error text.
 */
function scrubSentryEvent(
  event: import("@sentry/react").ErrorEvent
): import("@sentry/react").ErrorEvent | null {
  if (event.request) {
    delete event.request.cookies;
    delete event.request.headers;

    if (event.request.url) {
      try {
        const url = new URL(event.request.url);
        event.request.url = `${url.origin}${url.pathname}`;
      } catch {
        // not an absolute URL; leave it as-is
      }
    }
  }

  if (event.extra) {
    event.extra = redactObject(event.extra);
  }

  if (event.contexts) {
    for (const key of Object.keys(event.contexts)) {
      const context = event.contexts[key];

      if (context && typeof context === "object") {
        event.contexts[key] = redactObject(context as Record<string, unknown>);
      }
    }
  }

  return event;
}

function scrubSentryBreadcrumb(
  breadcrumb: import("@sentry/react").Breadcrumb
): import("@sentry/react").Breadcrumb | null {
  // Extra safety net even though the console breadcrumb integration is
  // disabled below: our own console.error calls elsewhere sometimes log
  // AppError.details, which can contain raw internal error objects.
  if (breadcrumb.category === "console") return null;

  if (breadcrumb.data) {
    breadcrumb.data = redactObject(breadcrumb.data);
  }

  return breadcrumb;
}

export async function initializeSentry() {
  if (initialized) return;
  initialized = true;

  const dsn = import.meta.env.VITE_SENTRY_DSN;

  if (!dsn) {
    console.warn("Missing VITE_SENTRY_DSN");
    return;
  }

  const Sentry = await import("@sentry/react");

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    sendDefaultPii: false,
    // No performance tracing and, critically, no Session Replay: Replay
    // records/screenshots the rendered DOM, which on /results would
    // capture follower/following usernames on screen. Neither is added
    // to `integrations` below.
    tracesSampleRate: 0,
    integrations: [Sentry.breadcrumbsIntegration({ console: false })],
    beforeBreadcrumb: scrubSentryBreadcrumb,
    beforeSend: scrubSentryEvent,
  });

  sentryModule = Sentry;

  console.log("Sentry initialized");
}

export function captureAppError(appError: AppError) {
  if (!sentryModule) return;

  // Only the AppError itself (static message + stack) is sent, tagged
  // with its code - never `appError.details`, which can carry raw
  // upload filenames or the original unknown error/value.
  sentryModule.captureException(appError, {
    tags: { code: appError.code },
  });
}

export function captureError(
  error: unknown,
  options: { tags?: Record<string, string> } = {}
) {
  if (!sentryModule) return;

  sentryModule.captureException(error, { tags: options.tags });
}
