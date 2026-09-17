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

Publishes the Storybook build to [Chromatic](https://www.chromatic.com/) for visual review/regression testing. It only runs when the `CHROMATIC_PROJECT_TOKEN` secret is present, which also means it is naturally skipped on pull requests from forks.

**Manual setup required** (cannot be done from this repo or by an agent):

1. Sign in to [chromatic.com](https://www.chromatic.com/) and link the `daevel/followoo` GitHub repository to create a Chromatic project.
2. Copy the project token Chromatic gives you.
3. In the GitHub repo, go to Settings > Secrets and variables > Actions, and add a new repository secret named `CHROMATIC_PROJECT_TOKEN` with that value.

Until that secret exists, the `chromatic` job is skipped (not failed) on every run.

## Preview deployments (Vercel)

This repo is already connected to Vercel through the Vercel GitHub App: production deployments are created by `vercel[bot]` and reported as a `Vercel` commit status (visible via the GitHub API, e.g. `GET /repos/daevel/followoo/commits/main/status`). The Vercel GitHub App automatically creates a preview deployment for every pull request as well.

Because of this, **no deploy-preview job was added to `ci.yml`** - it would duplicate what Vercel already does automatically for every PR.
