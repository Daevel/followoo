---
name: project-context
description: Followoo product and technical context. Use when implementing features, refactors, copy, architecture decisions, privacy behavior, or Instagram export analysis logic for this project.
---

# Project Context - Followoo

## What Followoo Is

Followoo is a privacy-focused React + Vite web app for analyzing Instagram relationship data from the official Instagram data export ZIP.

The core promise is simple:

```txt
Understand who follows you, who you follow, who does not follow you back, who recently unfollowed you, and related relationship statistics without logging in or sending data to a server.
```

Followoo is independent and is not affiliated with Instagram or Meta.

## Product Principles

- Privacy first: Instagram exports are processed locally in the browser.
- No Instagram login: never ask for Instagram credentials or Instagram OAuth access. This is unrelated to the Followoo *account* system (Clerk, v3.0.0) - signing in to Followoo with Google/email is about identifying a Followoo user for entitlement purposes, never about authenticating against Instagram itself.
- No Instagram API usage: analysis must rely on official export files only.
- No file uploads for analysis: user ZIP content must not be sent to application servers.
- No persistent storage of relationship data: uploaded data should disappear after refresh/close unless the user explicitly requests an export-oriented feature. This still holds with accounts (v3.0.0): `users`/`subscriptions`/`usage_events` store identity, entitlement, and generic usage analytics only - never Instagram export or relationship data. Persisting actual analysis results (encrypted snapshots) is separate, opt-in, future work (v3.1.0).
- Explainability: relationship results should be easy to understand and trace back to Instagram export data.
- Mobile-first usability: upload, filtering, sorting, and results must remain usable on small screens.

## Current User Workflow

1. User requests their Instagram data export from Instagram.
2. User downloads the ZIP archive.
3. User opens Followoo and uploads the ZIP.
4. Followoo extracts supported JSON files in the browser with `JSZip`.
5. Followoo normalizes relationship entries.
6. Followoo compares datasets and displays results instantly.

## Supported Instagram Export Data

The README documents the minimum expected structure:

```txt
connections/
└── followers_and_following/
    ├── followers_1.json
    ├── following.json
    ├── recently_unfollowed_profiles.json
    └── blocked_profiles.json
```

The current code also supports additional relationship files such as restricted users, close friends, hide stories from, pending follow requests, and recent follow requests when present in the export. Instagram exports may use either the historical `string_list_data` shape or newer `label_values` entries with labels such as `Username`, `URL`, and `Name`; parsers should support both.

Important implementation references:

- `src/features/instagram-export/services/instagramExportService.ts`: ZIP parsing and supported file routing.
- `src/features/relationship/services/instagramAnalysisService.ts`: relationship comparison logic.
- `src/features/instagram-export/parsers/*`: Instagram JSON normalization.
- `src/types/instagram.types.ts`: domain types for Instagram export data and analysis results.
- `src/features/instagram-export/utils/*` and `src/lib/*`: path detection, guards, search, pagination, formatting.

## Relationship Semantics

Use normalized usernames for comparisons. Trim and lowercase before comparing.

Core relationships:

- Mutual: the user follows an account and that account follows the user back.
- Followers only: an account follows the user, but the user does not follow it back.
- Following-only / not following back: the user follows an account, but that account does not follow the user. This is not an unfollow event.
- Recent unfollowers: accounts reported by Instagram export as recently unfollowed.
- Blocked, restricted, close friends, hidden stories: direct lists from supported Instagram export files.

Initial relationship vocabulary, where X is the current user's profile and Y is another profile:

- `MUTUAL`: X follows Y and Y follows X.
- `FOLLOWERS`: Y follows X, but X does not follow Y.
- `UNFOLLOWERS`: X follows Y, but Y does not follow X.
- `RECENT_UNFOLLOWERS`: direct list from `recently_unfollowed_profiles.json`.
- `BLOCKED`: direct list from `blocked_profiles.json`.

Avoid changing these semantics during refactors unless the user explicitly asks for product behavior changes.

## Tech Stack

- React 19.
- TypeScript 5.
- Vite 7.
- React Router 8.
- Tailwind CSS 4 via `@tailwindcss/vite`.
- GSAP for animations.
- JSZip for in-browser ZIP parsing.
- Recharts for charts.
- Storybook for component documentation and visual development.
- Biome 2.5 for formatting and lint checks.
- Vite PWA plugin for installable app behavior.
- PostHog is present for product analytics initialization; do not use it to track private Instagram relationship data. Feature flags (v3.0.0) use the same `posthog-js` instance via `useFeatureFlag(key, defaultValue)` (`src/analytics/useFeatureFlag.ts`) - always default-first (no server-side bootstrapping, this is a client-rendered SPA), and the default must match today's real behavior so a slow/unreachable PostHog changes nothing for the user. `usePostHogIdentity` (`src/analytics/`, mounted once in `src/AppRoutes.tsx`) calls `posthog.identify(userId)` on Clerk sign-in and `posthog.reset()` on sign-out, using the same Clerk `sub` as `users.id` on the backend - never re-invent a different id.
- Sentry (`@sentry/react`, initialized in `src/errors/sentryInit.ts`) is present for error tracking, wired through `src/errors/errorService.ts`'s `handleAppError` and `AppErrorBoundary`; do not use it to track private Instagram relationship data either (see Privacy And Analytics Rules below).

## Runtime Shape

- `src/main.tsx` mounts the app, configures `HelmetProvider`, `BrowserRouter`, global providers, and delegates client routing to `src/AppRoutes.tsx`.
- `src/AppRoutes.tsx` lazy-loads route pages for client bundle splitting, while `src/AppRoutesPrerender.tsx` imports route pages statically for SEO prerender output.
- `src/AppRouteTree.tsx` owns the shared route definitions used by both client and prerender route wrappers.
- `src/entry-prerender.tsx` and `scripts/prerender-static.mjs` generate static HTML for public SEO routes after the Vite client and SSR builds.
- Vercel should serve prerendered public SEO routes from the generated static files; only SPA-only routes such as `/results` should rewrite to `/index.html`.
- PWA service worker registration, update prompts, and manifest injection are handled by `vite-plugin-pwa`; do not add a manual `public/sw.js` or manual `/manifest.json` link.
- PWA install and update prompts use the global toast system via `src/features/pwa-install/hooks/usePwaInstallPrompt.ts` and `src/pwa/usePwaUpdateToast.ts`.
- `src/App.tsx` is the landing page composition.
- Page-level routes live in `src/pages`.
- Shared UI lives in `src/components/ui`.
- `src/services/`, `src/providers/`, and `src/lib/` hold shared services, React context providers, and technical utilities respectively; feature-owned services, hooks, schemas, and utils live under `src/features/<feature>/`. See the `project-scaffolding` skill for the full target structure and File Placement Decision Tree.
- Cross-cutting folders already exist at `src/analytics`, `src/animations`, `src/errors`, `src/pwa`, `src/data`, and `src/types`.
- Python FastAPI backend code lives under `backend/` and owns server-side public data endpoints such as `/updates`, plus (v3.0.0) account/entitlement endpoints (`GET /users/me`, `POST /usage-events`) authenticated via Clerk JWTs (`backend/app/auth`, `backend/app/users`).
- The React app calls the Python backend through `src/lib/api.ts` and `VITE_API_BASE_URL`; do not reintroduce the old `api/` and `server/` TypeScript updates path unless explicitly requested.
- The anonymous-analysis-then-account gate (`src/features/instagram-export/hooks/useFreeAnalysisGate.ts`) and current-user/entitlement data (`src/features/users/`) are the frontend halves of the v3.0.0 account system; `useAuth`/`useClerk`/`SignInButton`/`UserButton` come from `@clerk/react`, initialized in `src/main.tsx`.

## Privacy And Analytics Rules

- Never upload or log raw Instagram export contents.
- Never send usernames, follower lists, relationship lists, or derived private relationship data to analytics **or error tracking** (PostHog, Sentry) **or `usage_events`**. `posthog.identify()` (`usePostHogIdentity`) passes only the Clerk user id - no properties, no export/relationship data.
- Analytics events (PostHog, and backend `usage_events`) should describe generic product interactions only, such as page visits or feature usage - e.g. `analysis_run`, never anything about what was in the analyzed export.
- Error reporting must avoid embedding raw parsed data or file contents. Concretely for Sentry: only send an `AppError`'s `code`/message/stack, never its `details` (see `src/errors/sentryInit.ts`'s `captureAppError`); keep error messages static/developer-authored rather than interpolating usernames or export content into them; the same rule applies to the Python SDK on the backend (`backend/app/core/sentry.py`).
- If adding persistence, prefer explicit user-controlled exports/downloads over implicit browser storage.

## Product Copy Rules

- Be direct and reassuring about local processing.
- Do not imply official Instagram or Meta affiliation.
- Do not overpromise exact unfollow timing beyond what the export data supports.
- Prefer clear user terms like `followers`, `following`, `not following you back`, `recent unfollowers`, and `blocked users`.

## Useful Commands

- `npm run dev`: start local Vite development server.
- `npm run build`: TypeScript build, Vite client build, Vite SSR prerender bundle, then static HTML prerender for public SEO routes.
- `npm run lint`: Biome check.
- `npm run lint:fix`: Biome check with writes.
- `npm run format`: Biome format with writes.
- `npm run storybook`: start Storybook.
- `npm run build-storybook`: build Storybook.
- `backend/.venv/bin/python -m uvicorn app.main:app --reload --port 8000`: start the Python API from `backend/`.
- `backend/.venv/bin/python -m ruff check app` and `backend/.venv/bin/python -m mypy app`: verify the Python backend from `backend/`.

## Current Direction

`src/` already follows the target structure in the `project-scaffolding` skill (services/providers/hooks/schemas/utils moved out of `src/components/*` in 2026-07). Keep new code there directly rather than reintroducing a `src/components/services`-style catch-all. Refactors should stay incremental, preserve user-visible behavior, and make responsibilities clearer. The Python backend should grow inside `backend/` using feature routers, services, repositories, and schemas before considering a separate repository.
