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
- No Instagram login: never ask for credentials or OAuth access.
- No Instagram API usage: analysis must rely on official export files only.
- No file uploads for analysis: user ZIP content must not be sent to application servers.
- No persistent storage of relationship data: uploaded data should disappear after refresh/close unless the user explicitly requests an export-oriented feature.
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
- `src/features/instagram-export/utils/*`, `src/components/utils/*`, and `src/lib/*`: path detection, guards, search, pagination, formatting.

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
- PostHog is present for product analytics initialization; do not use it to track private Instagram relationship data.

## Runtime Shape

- `src/main.tsx` mounts the app, configures `HelmetProvider`, `BrowserRouter`, global providers, and delegates route composition to `src/AppRoutes.tsx`.
- `src/AppRoutes.tsx` is the shared route tree used by both the browser app and prerender entry.
- `src/entry-prerender.tsx` and `scripts/prerender-static.mjs` generate static HTML for public SEO routes after the Vite client and SSR builds.
- Vercel should serve prerendered public SEO routes from the generated static files; only SPA-only routes such as `/results` should rewrite to `/index.html`.
- PWA service worker registration, update prompts, and manifest injection are handled by `vite-plugin-pwa`; do not add a manual `public/sw.js` or manual `/manifest.json` link.
- PWA install and update prompts use the global toast system via `src/features/pwa-install/hooks/usePwaInstallPrompt.ts` and `src/pwa/usePwaUpdateToast.ts`.
- `src/App.tsx` is the landing page composition.
- Page-level routes live in `src/pages`.
- Shared UI currently lives in `src/components/ui`.
- Services, parsers, schemas, hooks, utils, and providers currently live under `src/components/*`, even when some of them are not React components. Refactors may improve this gradually, but do not move large areas without a clear migration goal.
- Cross-cutting folders already exist at `src/analytics`, `src/animations`, `src/errors`, `src/pwa`, `src/data`, and `src/types`.
- Python FastAPI backend code lives under `backend/` and owns server-side public data endpoints such as `/updates`.
- The React app calls the Python backend through `src/lib/api.ts` and `VITE_API_BASE_URL`; do not reintroduce the old `api/` and `server/` TypeScript updates path unless explicitly requested.

## Privacy And Analytics Rules

- Never upload or log raw Instagram export contents.
- Never send usernames, follower lists, relationship lists, or derived private relationship data to analytics.
- Analytics events should describe generic product interactions only, such as page visits or feature usage.
- Error reporting must avoid embedding raw parsed data or file contents.
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

Followoo started as a single React app and has accumulated structural complexity. Refactors should be incremental, preserve user-visible behavior, and make responsibilities clearer. The Python backend should grow inside `backend/` using feature routers, services, repositories, and schemas before considering a separate repository.
