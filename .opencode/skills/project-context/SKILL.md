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

The current code also supports additional relationship files such as restricted users, close friends, hide stories from, pending follow requests, and recent follow requests when present in the export.

Important implementation references:

- `src/components/services/instagramExportService.ts`: ZIP parsing and supported file routing.
- `src/components/services/instagramAnalisysService.ts`: relationship comparison logic.
- `src/components/parsers/*`: Instagram JSON normalization.
- `src/types/instagram.types.ts`: domain types for Instagram export data and analysis results.
- `src/components/utils/instagram/*` and `src/components/utils/*`: path detection, guards, search, pagination, formatting.

## Relationship Semantics

Use normalized usernames for comparisons. Trim and lowercase before comparing.

Core relationships:

- Mutual: the user follows an account and that account follows the user back.
- Followers only: an account follows the user, but the user does not follow it back.
- Unfollowers / not following back: the user follows an account, but that account does not follow the user.
- Recent unfollowers: accounts reported by Instagram export as recently unfollowed.
- Blocked, restricted, close friends, hidden stories: direct lists from supported Instagram export files.

Avoid changing these semantics during refactors unless the user explicitly asks for product behavior changes.

## Tech Stack

- React 19.
- TypeScript 5.
- Vite 7.
- React Router.
- Tailwind CSS 4 via `@tailwindcss/vite`.
- GSAP for animations.
- JSZip for in-browser ZIP parsing.
- Recharts for charts.
- Storybook for component documentation and visual development.
- Biome for formatting and lint checks.
- Vite PWA plugin for installable app behavior.
- PostHog is present for product analytics initialization; do not use it to track private Instagram relationship data.

## Runtime Shape

- `src/main.tsx` mounts the app, registers the service worker, configures `BrowserRouter`, global providers, error boundaries, and routes.
- `src/App.tsx` is the landing page composition and PWA install prompt behavior.
- Page-level routes live in `src/pages`.
- Shared UI currently lives in `src/components/ui`.
- Services, parsers, schemas, hooks, utils, and providers currently live under `src/components/*`, even when some of them are not React components. Refactors may improve this gradually, but do not move large areas without a clear migration goal.
- Cross-cutting folders already exist at `src/analytics`, `src/animations`, `src/errors`, `src/pwa`, `src/data`, and `src/types`.
- Vercel serverless/API endpoints live outside `src` under `api/`.
- Server-only services, repositories, and infrastructure shared by API endpoints live under `server/`.

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
- `npm run build`: TypeScript build plus Vite production build.
- `npm run lint`: Biome check.
- `npm run lint:fix`: Biome check with writes.
- `npm run format`: Biome format with writes.
- `npm run storybook`: start Storybook.
- `npm run build-storybook`: build Storybook.

## Current Direction

Followoo started as a single React app and has accumulated structural complexity. Refactors should be incremental, preserve user-visible behavior, and make responsibilities clearer without introducing monorepo or backend complexity unless explicitly requested.
