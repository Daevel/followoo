# AGENTS.md - Followoo

Root-level entry point for any coding agent (OpenCode or otherwise) working in this repository. Read this file first, before touching any code. It is deliberately short: it orients you and points to the right `.opencode/skills/*/SKILL.md` for the details, rather than duplicating them.

## What Followoo is

A privacy-first tool that analyzes a user's Instagram data export locally to show followers/following, mutuals, recent unfollowers, and blocked users, plus persona/engagement insights. No backend processing of Instagram export content; the only server-side data today is the public `/updates` changelog and (from v3.1.0) opt-in encrypted sync.

## Stack at a glance

- Frontend: React + Vite (TypeScript), Tailwind CSS 4, Storybook, Vitest
- Backend: Python FastAPI (`backend/`), Neon Postgres, Alembic migrations, psycopg_pool, slowapi rate limiting
- CI/CD: GitHub Actions (`.github/workflows/ci.yml`) - lint, build, unit tests, Chromatic
- Errors/observability: Sentry (frontend `@sentry/react`, backend `sentry_sdk`) with PII scrubbing
- Deploy: Vercel (frontend), GitHub App preview deployments per PR

## Essential commands

    npm run dev                  # local frontend dev server
    npm run build                # typecheck + build + SEO prerender
    npm run lint / lint:fix      # Biome
    npx vitest run --project unit
    npm run storybook / build-storybook
    backend/.venv/bin/python -m uvicorn app.main:app --reload --port 8000
    backend/.venv/bin/python -m ruff check app
    backend/.venv/bin/python -m mypy app

## Non-negotiable rules (apply regardless of task)

1. Never send Instagram export content, usernames, follower/following lists, or relationship-analysis results to any third-party service (Sentry included) - see the `project-context` and `python-backend` skills for the exact scrubbing pattern already in place.
2. Never imply official Instagram/Meta affiliation in product copy.
3. Commit messages: always English, Conventional Commits format - see the `git-commits` skill.
4. Before `git push`: always run the `pre-push-sync-knowledge` flow.
5. Public `/updates` entries: only for end-user-visible changes - see the `public-changelog` skill's decision rule before writing one.

## Skills index

This repo ships project-specific OpenCode skills under `.opencode/skills/`. Each one is auto-loaded by its own `description` frontmatter when a task matches it - this file does not replace that mechanism, it is the static map for when you need to find the right one deliberately, or when you're doing something broad enough to touch several:

| Skill | Use it for |
|---|---|
| `project-context` | Product behavior, privacy model, supported Instagram export formats, useful commands, current architectural direction |
| `project-scaffolding` | Where a new file/folder belongs, `src/` structure, routing, refactor rules |
| `python-backend` | FastAPI backend conventions, endpoint/repository/service structure, deployment notes |
| `git-commits` | Commit format, scopes, staging, Husky hook, verification before commit |
| `pre-push-sync-knowledge` | Mandatory check before `git push`: keep skills/docs in sync with what changed |
| `storybook-component-creation` | Adding/updating `src/stories/*.stories.tsx` |
| `public-changelog` | Deciding if a change belongs on the public `/updates` page, and how to write/publish it |

If a task spans more than one of these (e.g. a refactor that also needs a commit and a push), follow them in that natural order: scaffolding/backend/storybook skill for the change itself -> `git-commits` for the commit -> `pre-push-sync-knowledge` before pushing -> `public-changelog` only if the change is user-facing.

## When a skill and this file disagree

The skill wins for its own domain - this file is intentionally shallow and skills are the source of truth for details. If you find a genuine contradiction, flag it instead of silently picking one.
