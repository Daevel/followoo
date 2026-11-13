# CI Pipeline

Defined in [`.github/workflows/ci.yml`](../.github/workflows/ci.yml). Runs on every pull request targeting `main` or `preview`, and on every push to `main` or `preview` (see `AGENTS.md`'s "Environments" note for what those two branches are).

## `verify` job

Frontend checks. Always runs, no secrets required:

1. `actions/checkout`
2. `actions/setup-node` (Node 24 - the repo has no `.nvmrc` or `package.json` `engines` field yet; this pins to the Node major version used locally, see `devDependencies["@types/node"]`)
3. `npm ci`
4. `npm run lint` (Biome)
5. `npm run build` (`tsc -b` + Vite client/SSR build + static prerender)
6. `npx vitest run --project unit` - runs only the `unit` Vitest project (pure parsing/relationship-analysis logic). The `storybook` Vitest project (`@storybook/addon-vitest`) needs Playwright browsers installed in the runner and is intentionally left out of this base pipeline.

## `backend-verify` job

Backend checks, running against a real `postgres:16` service container (`app/users/repository.py` is raw SQL - upserts, JSONB - that a mocked connection couldn't prove correct, and `backend/tests/users/` exercises it for real). Always runs, no secrets required:

1. `actions/checkout`
2. `actions/setup-python` (3.13, pip cache keyed on `backend/requirements.txt`)
3. `pip install -r requirements.txt ruff mypy pytest httpx` (mirrors local dev - see `backend/README.md`)
4. `ruff check app tests`
5. `mypy app` and `mypy tests`
6. `alembic upgrade head` against the service container's empty database
7. `pytest` (`backend/tests/`)

## `chromatic` job

Publishes the Storybook build to [Chromatic](https://www.chromatic.com/) for visual review/regression testing. It runs on every push and on every same-repo pull request, and is a required status check for merging into `main` (branch protection, set 2026-11-13). `preview` has no branch protection on purpose: it receives direct pushes, which a required check would block; only PRs from forks skip it (they never get secrets). If `CHROMATIC_PROJECT_TOKEN` is missing it fails with an explicit `Missing secret CHROMATIC_PROJECT_TOKEN` annotation instead of skipping.

The token comes from chromatic.com: link the `Daevel/followoo` repository as a **Storybook** project (not React Native), then copy its project token into the `CHROMATIC_PROJECT_TOKEN` repository secret (Settings > Secrets and variables > Actions).

Storybook wraps every story in a `ClerkProvider` (`.storybook/preview.tsx`), so Clerk-aware components such as `NavBar` render. Without a `VITE_CLERK_PUBLISHABLE_KEY` (as in CI) Clerk gets an offline stub that never loads: snapshots are deterministic and never show Clerk's signed-in/signed-out UI such as "Sign in".

## Preview deployments (Vercel)

This repo is already connected to Vercel through the Vercel GitHub App: production deployments are created by `vercel[bot]` and reported as a `Vercel` commit status (visible via the GitHub API, e.g. `GET /repos/daevel/followoo/commits/main/status`). The Vercel GitHub App automatically creates a preview deployment for every pull request as well.

Because of this, **no deploy-preview job was added to `ci.yml`** - it would duplicate what Vercel already does automatically for every PR.

## Database migrations against real environments

`ci.yml`'s `backend-verify` job runs `alembic upgrade head` (step 6 above), but only against the ephemeral `postgres:16` service container it creates for that run - this only proves the migrations are valid and apply cleanly against a clean database. It never touches the real Neon databases; the `Migrations` workflow below covers real data.

Applying migrations against those two real databases is handled by [`backend/start.sh`](../backend/start.sh), which both Render services (`followoo-api`, `followoo-api-preview`) run as their **Start Command** instead of calling `uvicorn` directly - it runs `alembic upgrade head` before starting the API, on every boot of the instance. (Render's Pre-Deploy Command would have been the more direct fit, but that feature requires a paid web service plan; both services are on the free tier.) See `backend/README.md`'s "Applying migrations in deploy" section for the full explanation of why, and what happens if the migration fails.

## `Migrations` workflow (`migrations.yml`)

Runs only when `backend/alembic/**`, `backend/alembic.ini` or the workflow itself change (PRs and pushes to `preview`/`main`), or on manual dispatch:

- `dry-run`: creates a temporary Neon branch from `preview-backend` (`ci-migration-dry-run-<run id>`), runs `alembic upgrade head` there against real schema and rows, then always deletes the branch, even if the migration failed (the branch also carries a 2-hour Neon expiry as a safety net). Needs the `NEON_API_KEY` secret.
- `apply-preview`: on `preview` only (never PRs, never production), after `dry-run` passes, runs `alembic upgrade head` against the real `preview-backend` branch so its state is visible in CI logs. It complements `backend/start.sh`, it does not replace it. Needs the `PREVIEW_DATABASE_URL` secret: a connection string kept separate from the app's own so CI access can be rotated on its own.

## `deploy-env-check` job

On pushes to `preview`/`main`, [`scripts/check-deploy-env.mjs`](../scripts/check-deploy-env.mjs) lists the environment variable **names** (never values) on Vercel (production and preview targets) and on both Render services (including linked environment groups), and fails with one annotation per missing required variable. The required lists live at the top of the script - keep them in sync with `.env.example` and `backend/README.md`. Needs the `VERCEL_TOKEN` and `RENDER_API_KEY` secrets. Vercel and Render deploy on their own from the same push, so this job reports a misconfiguration loudly; it cannot block the deploy.

## `smoke-test` job

On pushes to `preview`/`main`, after `verify` and `backend-verify`, [`scripts/smoke-test-deploy.mjs`](../scripts/smoke-test-deploy.mjs):

1. waits for the GitHub Deployment that Vercel's GitHub App reports for the commit (`Preview` or `Production`) to succeed - using `GITHUB_TOKEN`, no Vercel token;
2. checks `GET /health` on the matching Render backend (`followoo-api-preview` or `followoo-api`) answers 200, retrying through cold starts;
3. opens the stable frontend URL (`https://followoo-git-preview-daevels-projects.vercel.app` or `https://followoo.app`) in Playwright and checks Clerk finishes loading, with no Clerk console/network errors, and "Sign in" renders. PostHog requests are blocked so these visits stay out of analytics.

The preview alias is behind Vercel Deployment Protection (SSO), so `preview` runs need the `VERCEL_AUTOMATION_BYPASS_SECRET` secret (Vercel > project > Settings > Deployment Protection > Protection Bypass for Automation). The script sends it once as a header to obtain the bypass cookie, so it never appears in a page URL.

## Secrets used by CI

| Secret | Used by | Where to create it |
|---|---|---|
| `CHROMATIC_PROJECT_TOKEN` | `chromatic` | chromatic.com, after linking this repo |
| `VERCEL_TOKEN` | `deploy-env-check` | Vercel > Account Settings > Tokens, scoped to the team owning `followoo` |
| `RENDER_API_KEY` | `deploy-env-check` | Render > Account Settings > API Keys |
| `VERCEL_AUTOMATION_BYPASS_SECRET` | `smoke-test` (preview) | Vercel > `followoo` > Settings > Deployment Protection > Protection Bypass for Automation |
| `NEON_API_KEY` | `Migrations` / `dry-run` | Neon Console > Account settings > API keys (or an org/project-scoped key) |
| `PREVIEW_DATABASE_URL` | `Migrations` / `apply-preview` | Neon Console > `followoo-database` > `preview-backend` > Connect |

Every job that needs one of these fails with an explicit `Missing secret <NAME>` annotation while it is absent.
