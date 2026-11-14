---
name: scripts-folder
description: The scripts/ folder - what each Followoo script does, who runs it (npm script, Husky, CI workflow) and the rule that scripts act while skills guide agents. Use when adding, changing or looking for a script in scripts/, or when tempted to put agent logic into a script or script logic into a skill.
---

# scripts/ Folder - Followoo

## Principle: a script acts, a skill guides

- **A script performs one concrete, repeatable action.** Same input, same result. It is run by a person, an npm script, Husky or a CI workflow. It does not make judgment calls that belong to an agent, such as whether docs need updating or whether a change is impactful.
- **A skill documents and guides an agent's judgment.** It says when to run a script and how to read its result. It never re-implements the script's logic in prose: if behavior changes, the script changes and the skill only points to it.
- **Don't turn `scripts/` into "smart" automation that replaces a skill.** Don't make a skill a copy of a script either. When both are needed, the script holds the mechanics and the skill holds when and why.

## What is in `scripts/` today

| File | What it does | Run by |
|---|---|---|
| `pre-commit-biome.sh` | Biome auto-fix on commit, re-stages the already-staged files, then re-checks. See the `husky-pre-commit` skill. | Husky (`npm run precommit`) |
| `prerender-static.mjs` | Last step of `npm run build`: renders the public routes with the SSR entry (`dist-ssr/entry-prerender.js`) into static `dist/<route>/index.html` for SEO. Its route list must match the public routes. | `npm run build` |
| `generate-marketing-assets.mjs` | Captures README screenshots, `demo.gif`, `OG.png` and PWA screenshots from the built app with Playwright. See the `marketing-assets-automation` skill. | `npm run generate:assets`; `.github/workflows/regenerate-marketing-assets.yml` |
| `templates/og-template.html` | Template for `OG.png`. Design tokens are injected from `src/index.css` at render time. | `generate-marketing-assets.mjs` |
| `check-deploy-env.mjs` | Checks that the required env var **names** exist on Vercel (production and preview) and on both Render services. It never reads values. | CI job `deploy-env-check` (`.github/workflows/ci.yml`) |
| `smoke-test-deploy.mjs` | After a push to `preview`/`main`: waits for the Vercel deployment, checks the backend `/health`, then checks that Clerk loads and "Sign in" renders. | CI job `smoke-test` (`.github/workflows/ci.yml`) |

Not here, on purpose:

- **Neon/Alembic migrations in CI** (the dry-run on a temporary Neon branch and the apply to `preview-backend`) are steps of `.github/workflows/migrations.yml`. They use the official Neon actions plus `alembic`; there is no script.
- **Migrations on Render boot** run from `backend/start.sh`, which belongs to the backend (see the `python-backend` skill).
- CI behavior and the secrets these scripts need are documented in `docs/CI.md`.

## Keeping this current

Whenever a file in `scripts/` is added, removed, renamed or changes purpose, update the table above in the same push. `pre-push-sync-knowledge` lists this skill among its knowledge files.
