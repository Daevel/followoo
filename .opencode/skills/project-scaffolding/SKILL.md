---
name: project-scaffolding
description: Defines Followoo React + Vite project structure, scaffolding rules, and architectural boundaries. Use when creating pages, features, components, hooks, services, or refactors.
---

# Project Scaffolding - Followoo

## Purpose

This skill defines the structural rules for Followoo, a single React + Vite application.

Use it when:

- creating or moving pages;
- creating or moving feature code;
- creating shared UI components;
- creating hooks, services, parsers, utilities, schemas, or types;
- refactoring folder structure;
- deciding whether code belongs in app-level, feature-level, domain-level, or shared-level folders.

The goal is to reduce accumulated structural complexity while keeping refactors incremental and safe.

## Core Architecture

Followoo is a single-application repository, not a monorepo.

Current project shape:

```txt
followoo/
├── .opencode/
│   └── skills/
├── .storybook/
├── api/
├── docs/
├── public/
├── scripts/
├── server/
├── src/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── biome.json
```

Responsibility boundaries:

```txt
src/        -> browser application source
api/        -> Vercel/serverless endpoints, not browser UI code
server/     -> server-only services, repositories, and infrastructure shared by api endpoints
public/     -> static public assets
docs/       -> documentation and images
scripts/    -> local automation
.opencode/  -> agent skills and OpenCode project configuration
```

## Target `src` Structure

Followoo currently has historical code under `src/components/*`. New code and refactors should move gradually toward this structure:

```txt
src/
├── app/
├── analytics/
├── animations/
├── components/
│   └── ui/
├── data/
├── errors/
├── features/
├── hooks/
├── lib/
├── pages/
├── providers/
├── pwa/
├── schemas/
├── services/
├── types/
└── main.tsx
```

Folder responsibilities:

```txt
app/          -> app composition helpers, route config, app-level layout helpers
analytics/    -> analytics initialization, event names, analytics service wrappers
animations/   -> GSAP setup, animation tokens, reusable animation hooks/presets
components/ui -> reusable presentational UI primitives and app-level UI pieces
data/         -> static data, update content, external data shape docs
errors/       -> app error model, error mapping, error boundaries helpers
features/     -> domain/product features grouped by capability
hooks/        -> shared React hooks not owned by one feature
lib/          -> small technical utilities independent of React UI and domain features
pages/        -> route-level page components
providers/    -> React context providers
pwa/          -> service worker registration and PWA config
schemas/      -> shared Zod schemas
services/     -> shared application/domain services
types/        -> shared TypeScript types and declarations
```

Do not create broad synonym folders such as:

```txt
common/
helpers/
modules/
screens/
shared/
views/
```

Use the existing target folders instead.

## Incremental Migration Rule

Do not perform large folder migrations as a side effect of a small feature.

Because existing code currently includes paths like `src/components/services`, `src/components/utils`, `src/components/hooks`, `src/components/schemas`, and `src/components/providers`, follow this rule:

```txt
Small feature or bug fix -> follow nearby existing structure.
Focused refactor -> move one coherent responsibility at a time toward target structure.
New isolated capability -> place it directly in the target structure.
```

When moving files, update imports and run the relevant checks.

## Pages And Routing

Routing is configured in `src/main.tsx` with React Router.

Current route page components live in:

```txt
src/pages/
```

Page rules:

- Pages compose feature components, shared UI, providers, and SEO.
- Pages should stay thin and avoid complex parsing, filtering, or business logic.
- Move complex stateful/domain logic into feature hooks or services.
- Page components should be named by route intent, such as `ResultPage`, `GetStarted`, or `PrivacyPolicy`.
- Keep route path changes explicit; do not rename public URLs during structural refactors unless requested.

Example target page:

```tsx
import { ResultsExperience } from "@/features/results/components/ResultsExperience";

export function ResultPage() {
  return <ResultsExperience />;
}
```

## Features

Feature code should live under:

```txt
src/features/<feature>/
```

Recommended shape:

```txt
features/<feature>/
├── components/
├── hooks/
├── services/
├── schemas/
├── types/
├── utils/
├── constants/
└── index.ts
```

Only create folders that are needed. Do not create empty folders.

Likely Followoo feature boundaries:

```txt
features/instagram-export  -> ZIP parsing, export file recognition, parser orchestration
features/results           -> relationship result UI, tabs, filters, sorting, pagination
features/relationship      -> relationship analysis, health, persona, engagement insights
features/landing           -> homepage sections and landing-only behavior
features/support           -> support form, schema, service integration
features/updates           -> changelog/update display
features/pwa-install       -> install prompt UX if it grows beyond app-level behavior
```

Use these as guidance, not as mandatory folders. Prefer one focused feature over many tiny artificial features.

## UI Components

Shared reusable UI belongs in:

```txt
src/components/ui/
```

UI component rules:

- Components in `components/ui` must be reusable and mostly presentational.
- They may know visual design language, accessibility behavior, and interaction patterns.
- They should not own Instagram export parsing or relationship analysis logic.
- If a component is only meaningful for one feature, keep it inside that feature.
- Keep Storybook stories close to existing project convention in `src/stories` unless a Storybook refactor is explicitly requested.

Correct shared UI examples:

```txt
Button
Input
Checkbox
Card
Callout
Paginator
SortSelect
Toast
ZipDropzone
ResultPieChart
```

Feature-specific examples that should not be added directly to `components/ui` unless intentionally shared:

```txt
InstagramExportAnalyzer
ResultsDashboard
RelationshipTabsController
SupportForm
UpdateTimeline
```

## Services

Shared services should live in:

```txt
src/services/
```

Feature-owned services should live in:

```txt
src/features/<feature>/services/
```

Service rules:

- Keep services free from React rendering concerns.
- Prefer pure functions for analysis and normalization.
- Keep browser-only APIs explicit when used, such as `File`, `localStorage`, or `window`.
- Do not send private Instagram data to network services.

Existing services under `src/components/services` can be migrated gradually when touched by a focused refactor.

## Parsers And Instagram Export Logic

Instagram parsing is domain logic, not UI logic.

Target placement:

```txt
src/features/instagram-export/parsers/
src/features/instagram-export/services/
src/features/instagram-export/utils/
```

Rules:

- Keep ZIP extraction separate from JSON shape parsing.
- Keep path detection helpers separate from relationship analysis.
- Preserve support for all currently parsed export files unless the user requests otherwise.
- Fail with app-level errors instead of raw thrown strings.
- Ignore unsupported JSON files safely.
- Do not log file contents or parsed private data.

## Relationship Analysis Logic

Relationship analysis should be pure and testable.

Target placement:

```txt
src/features/relationship/services/
```

Rules:

- Normalize usernames before comparison.
- Deduplicate by normalized username.
- Keep the semantics of mutual, followers-only, unfollowers, recent unfollowers, blocked, restricted, close friends, and hidden stories stable.
- Keep sorting/filtering/pagination separate from core relationship computation.
- Avoid coupling analysis services to React components.

## Hooks

Shared hooks belong in:

```txt
src/hooks/
```

Feature-specific hooks belong in:

```txt
src/features/<feature>/hooks/
```

Rules:

- Hooks may use React state/effects and browser APIs.
- Hooks should not hide large domain algorithms that could be pure services.
- Keep animation hooks in `src/animations` when they are specifically GSAP/animation-oriented.

## Utilities And Lib

Use `src/lib` for small technical utilities that are not tied to a specific domain feature.

Use feature `utils/` folders for utilities that only make sense inside that feature.

Avoid dumping unrelated functions into a global `utils` folder. If touching existing `src/components/utils`, either keep the change minimal or migrate a coherent subset to the correct target folder.

## Types And Schemas

Shared types belong in:

```txt
src/types/
```

Feature-specific types belong in:

```txt
src/features/<feature>/types/
```

Shared schemas belong in:

```txt
src/schemas/
```

Feature-specific schemas belong in:

```txt
src/features/<feature>/schemas/
```

Rules:

- Keep Instagram export/domain types stable and reusable.
- Do not place component prop types in global `src/types` unless they are shared across unrelated areas.
- Prefer explicit exported types for service inputs and outputs.

## Providers

React providers should live in:

```txt
src/providers/
```

Provider rules:

- Providers should manage cross-cutting React context only.
- Do not place general domain services in providers.
- Keep provider composition visible near `src/main.tsx` or an app-level composition file.

## API Folder

The `api/` directory is for Vercel/serverless endpoints.

Rules:

- Do not import browser UI code from `api/`.
- Do not import server-only code into `src/` browser bundles.
- Keep endpoint code focused and validate inputs explicitly.
- Never accept uploaded Instagram ZIP contents in server endpoints unless the user explicitly changes the privacy model.

## Imports

Use the configured alias for source imports:

```ts
import { Button } from "@/components/ui/Button";
```

Rules:

- Prefer `@/` for cross-folder imports inside `src`.
- Relative imports are fine within the same folder or nearby files.
- Avoid deep imports across feature internals. Export intentional feature APIs from `index.ts` when useful.
- Do not create barrel files by default; add them only when they reduce import noise for stable public surfaces.

## Styling

Followoo uses Tailwind CSS 4.

Rules:

- Preserve the existing visual language unless the user asks for redesign.
- Keep responsive behavior explicit for desktop and mobile.
- Use existing design tokens/classes where present in `src/index.css`.
- Shared UI components should expose `className` when composition needs it.
- Do not introduce a second styling system without explicit approval.

## Animations

Animation code belongs in `src/animations` or feature-local animation hooks when tightly scoped.

Rules:

- Use existing GSAP setup and animation token conventions.
- Keep animation selectors and refs understandable.
- Respect cleanup to avoid duplicated animations after route changes or remounts.
- Do not mix domain logic into animation hooks.

## PWA

PWA code belongs in:

```txt
src/pwa/
```

Rules:

- Keep service worker registration and PWA configuration isolated.
- App install prompt UI can stay app-level while small.
- If install behavior grows, move it into `features/pwa-install`.
- Do not cache private uploaded Instagram data.

## Errors

Error modeling belongs in:

```txt
src/errors/
```

Rules:

- Use `AppError` and `ERROR_CODES` for user-facing operational errors.
- Keep raw low-level errors out of UI copy.
- Avoid including private data in error details.
- Route/page error UI should stay in page, app, or feature UI layers.

## Storybook

Current stories live in:

```txt
src/stories/
```

Rules:

- Add or update stories for reusable UI components when behavior or visual variants change.
- Keep stories focused on component states and accessibility-relevant variants.
- Do not move all stories during unrelated refactors.

## Testing And Verification

Use the narrowest relevant verification after edits.

Common commands:

```txt
npm run lint
npm run build
npm run storybook
npm run build-storybook
```

For structural refactors, at minimum run:

```txt
npm run lint
npm run build
```

If a change touches Storybook stories or shared UI behavior, also run Storybook-related checks when feasible.

## Refactor Rules

- Prefer small, coherent moves over broad rewrites.
- Preserve behavior unless behavior change is the explicit goal.
- Move one responsibility at a time.
- Update imports immediately after moving files.
- Do not add compatibility wrappers unless there is a concrete external consumer or staged migration need.
- Do not introduce backend processing for Instagram data as part of frontend cleanup.
- Avoid creating new abstractions until at least two real call sites need them.

## File Placement Decision Tree

When creating a file, decide in this order:

1. Is it a route-level page? Use `src/pages` or nearby existing page location if doing a minimal change.
2. Is it specific to one product capability? Use `src/features/<feature>`.
3. Is it reusable visual UI? Use `src/components/ui`.
4. Is it shared React behavior? Use `src/hooks`.
5. Is it pure/shared domain or application logic? Use `src/services`, `src/types`, `src/schemas`, or `src/lib` based on responsibility.
6. Is it analytics, animation, error, PWA, or data infrastructure? Use the existing dedicated top-level folder.
7. Is it serverless? Use `api/`.

If none fits, ask whether a new top-level folder is warranted instead of inventing one silently.
