# Followoo API

Python API for Followoo server-side features.

## Local Development

Create `backend/.env` with:

```txt
FOLLOWOO_DATABASE_URL="postgresql://..."
FOLLOWOO_CORS_ORIGINS="http://localhost:5173,http://127.0.0.1:5173"
FOLLOWOO_SENTRY_DSN=""
FOLLOWOO_ENVIRONMENT="development"
FOLLOWOO_CLERK_JWKS_URL=""
```

`FOLLOWOO_SENTRY_DSN` and `FOLLOWOO_ENVIRONMENT` are optional - see
[Error Tracking (Sentry)](#error-tracking-sentry) below. Never commit a real
DSN; leave it unset/empty locally unless you are deliberately testing
against your own Sentry project.

`FOLLOWOO_CLERK_JWKS_URL` is required for `/auth/me` (and any future
Clerk-protected endpoint) to work - see
[Authentication (Clerk)](#authentication-clerk) below.

In production, configure `FOLLOWOO_CORS_ORIGINS` on the backend host with the
public frontend origins:

```txt
FOLLOWOO_CORS_ORIGINS="https://followoo.app,https://www.followoo.app"
```

### Preview environment

Besides the production service, a second Render service
(`followoo-api-preview`) tracks the `preview` branch instead of `main`,
with its own environment variables:

- `FOLLOWOO_DATABASE_URL` -> dedicated Neon branch `preview-backend` (not
  the production database; created manually, independent of the
  Vercel-Neon integration's automatic branch lifecycle)
- `FOLLOWOO_CORS_ORIGINS` ->
  `http://localhost:5173,http://127.0.0.1:5173,https://followoo.app,https://www.followoo.app,https://followoo-git-preview-daevels-projects.vercel.app`
  (no trailing slash on any origin, or the CORS match fails)
- `FOLLOWOO_ENVIRONMENT=preview`

Preview backend URL: `https://followoo-api-preview.onrender.com`
Preview frontend URL: `https://followoo-git-preview-daevels-projects.vercel.app`

On Vercel, `VITE_API_BASE_URL` is set as a "Preview"-scoped variable to the
preview backend URL above.

See the repo root `AGENTS.md` "Environments" note for the overall `main`
vs `preview` flow.

Start the API from `backend/`:

```bash
python3 -m uvicorn app.main:app --reload --port 8000
```

Health check:

```txt
GET http://localhost:8000/health
```

Updates endpoint:

```txt
GET http://localhost:8000/updates
```

Run the test suite (`tests/`, mirroring `app/`) and dev-tool checks from
`backend/` with the dev extras installed (`pip install -e ".[dev]"` or
`pip install -r requirements.txt pytest ruff mypy httpx`):

```bash
./.venv/bin/python -m pytest
./.venv/bin/python -m ruff check app
./.venv/bin/python -m mypy app
```

`tests/auth/` stubs the JWKS fetch and needs no database. `tests/users/`
does: it exercises real SQL (upserts, JSONB) against `FOLLOWOO_DATABASE_URL`,
so point that at a real local/test Postgres with migrations applied
(`alembic upgrade head`) before running `pytest` - see
[Users & Entitlement](#users--entitlement) and
[Database Migrations](#database-migrations-alembic) below. CI does this
automatically against a `postgres:16` service container (see
`docs/CI.md`).

## Database Connections

`app/db.py` keeps a `psycopg_pool.ConnectionPool` (min 1, max 5 connections)
instead of opening a new Postgres connection per request. The pool is opened
on app startup and closed on shutdown via the FastAPI `lifespan` in
`app/main.py`. Repositories still use `get_connection()` as a context
manager exactly as before
(`with get_connection() as connection, connection.cursor() as cursor:`) -
it now borrows/returns a pooled connection instead of opening/closing one.

## Rate Limiting

Public endpoints (currently `/updates`, `/users/me`, and `/usage-events`)
are rate limited per client IP with `slowapi` at 30 requests/minute, using
the shared limiter in `app/core/limiter.py`. Exceeding the limit returns
`429` with a JSON body. `/health` is intentionally not rate limited so
uptime checks stay cheap and reliable. When a backend-side support/contact
endpoint is added, apply the same `@limiter.limit(PUBLIC_RATE_LIMIT)`
decorator to it - it does not exist in the backend yet (the support form is
still frontend-only).

## Authentication (Clerk)

`app/auth/clerk.py` verifies Clerk session JWTs locally against Clerk's
public JWKS - no call to Clerk's API happens per request, and no Clerk
Secret Key is needed (JWKS signature verification only needs public keys).
`get_current_clerk_user_id` is a FastAPI dependency (`Depends(...)`) that
reads the `Authorization: Bearer <token>` header, verifies the signature
(RS256) via `PyJWT`'s `PyJWKClient` (which fetches and caches the JWKS
document itself), checks expiry, and validates the `azp` claim against
`FOLLOWOO_CORS_ORIGINS` - the same origin(s) already trusted for CORS are,
for this app's single-SPA setup, the same origin(s) Clerk mints tokens for.
On any failure it raises a `401` with a structured
`{"code": "...", "message": "..."}` body (`AUTH_TOKEN_MISSING`,
`AUTH_TOKEN_EXPIRED`, or `AUTH_TOKEN_INVALID`) instead of a bare exception -
there is no dedicated `AppError`/`ERROR_CODES` class in this Python backend
the way there is in `src/errors/` on the frontend, so this mirrors that
pattern's intent on top of the existing `HTTPException` convention.

**Setup**: in the Clerk dashboard for your application, find the JWKS URL
under API Keys (or use `<your Frontend API URL>/.well-known/jwks.json`) and
set it as `FOLLOWOO_CLERK_JWKS_URL`. For now, both `main` and `preview` use
the same single Clerk application in development mode (see the repo root
`AGENTS.md`), so this is the same value on both Render services - splitting
Clerk environments the way `FOLLOWOO_DATABASE_URL` is split per branch is
future work, not required today.

`get_current_clerk_claims` is the same check, returning the full claim set
(e.g. for an `email` claim, if the Clerk JWT template has been customized
to include one) instead of just `sub` - `app/users/router.py` uses it for
`GET /users/me`.

**Testing it locally**: sign in on the frontend (with `VITE_CLERK_PUBLISHABLE_KEY`
configured), get a session token from Clerk client-side (e.g.
`await window.Clerk.session.getToken()` in the browser console), and call:

```bash
curl -H "Authorization: Bearer <token>" http://localhost:8000/users/me
```

A missing, expired, or tampered-with token should get a `401` instead.

## Users & Entitlement

`backend/app/users/` (router, service, repository, schemas, dependencies -
the same feature-module shape as `app/auth/` and `app/updates/`) owns user
identity and the Base/Pro entitlement model, added for v3.0.0 Task 2:

- `users.id` is the Clerk JWT `sub` claim directly - no separate internal
  id. A row is lazily created on a user's first verified request
  (`get_or_create_user`); there is no Clerk webhook for this.
- `subscriptions` is the entitlement source of truth. `get_entitlement`
  resolves `"pro"` when a row with `status` `active` or `trialing` exists
  for that user, otherwise `"base"` - never from a stored `plan` field on
  `users`, so it can't drift from what Stripe actually reports.
  `subscriptions` stays empty until v3.0.0 Task 3 wires up Stripe, so
  **every user resolves to `"base"` today - that is the expected state,
  not a bug**.
- `usage_events` is analytics only (e.g. `analysis_run`), never a usage
  cap - a Base account can run unlimited analyses. Never accept Instagram
  export/relationship data in `metadata` - see
  `.opencode/skills/project-context/SKILL.md`.
- `require_entitlement(min_level)` is a dependency factory for gating a
  route behind a minimum plan (`Depends(require_entitlement("pro"))`),
  raising `403` (`ENTITLEMENT_INSUFFICIENT`) otherwise. No route uses
  `min_level="pro"` yet - the first Pro-only feature ships in v3.1.0 - but
  the check is built and tested now so that feature doesn't have to design
  and test the gate itself too.

Endpoints:

- `GET /users/me` - `get_or_create_user`s the caller, returns
  `{"user_id", "email", "plan"}`. Replaces the temporary `GET /auth/me`
  from Task 1 (removed, not kept alongside this).
- `POST /usage-events` - body `{"event_type": "analysis_run"}` (or any
  other free-form event name), logs one row. Also lazily provisions the
  user first, since a client's first backend call could plausibly be this
  endpoint rather than `GET /users/me`.

The account gate itself - free anonymous analyses vs. requiring sign-in
from the second one on - lives on the frontend
(`src/features/instagram-export/hooks/useFreeAnalysisGate.ts`): a
`localStorage` flag is a deliberately soft, bypassable signal (the
anonymous analysis costs the backend nothing, so a bypass is a lost funnel
opportunity, not a security issue), but every authenticated backend call
still goes through the real JWT check above regardless.

## Error Tracking (Sentry)

`app/core/sentry.py` initializes the
[Python Sentry SDK](https://docs.sentry.io/platforms/python/) from
`FOLLOWOO_SENTRY_DSN` (optional) and `FOLLOWOO_ENVIRONMENT` (defaults to
`development`), read through `pydantic-settings` the same way
`FOLLOWOO_DATABASE_URL`/`FOLLOWOO_CORS_ORIGINS` are. `init_sentry()` is a
no-op when `FOLLOWOO_SENTRY_DSN` is unset, so Sentry stays fully disabled by
default (e.g. in this repo's CI and in anyone's local dev unless they opt
in).

**Setup**: create a Sentry account/project at
[sentry.io](https://sentry.io) (Python/FastAPI platform), copy its DSN, and
set `FOLLOWOO_SENTRY_DSN` in `backend/.env` locally or as an environment
variable on the deploy host. **Never commit a real DSN** to this repo -
treat it like any other secret, even though Sentry DSNs are not
request-forging secrets by design (they only accept event writes).

**Privacy**: this integration must never send Instagram export content,
usernames, follower/following lists, or relationship analysis results to
Sentry - the same non-negotiable rule already applied in `app/updates` and
documented in `.opencode/skills/project-context/SKILL.md`. Concretely:

- `traces_sample_rate=0.0` (tracing/profiling is disabled entirely).
- `send_default_pii=False` (no automatic IP/cookie/header attachment).
- `before_send` (`scrub_event` in `app/core/sentry.py`) strips request
  headers/cookies/query strings and redacts any `extra`/`contexts` key
  matching an Instagram/relationship-data pattern before an event leaves
  the process.
- Routers only ever call `sentry_sdk.capture_exception(error)` with the
  exception itself, never with parsed row data or request bodies as extra
  context.
- This scrubbing only reaches structured fields; it cannot rewrite a free
  text exception message a future bug might accidentally build from
  private data. Keep raising `AppError`-style errors with static,
  developer-authored messages (see `app/updates/repository.py`) rather
  than interpolating user/export data into error text.

**Testing it locally**: with `FOLLOWOO_SENTRY_DSN` set to your own project's
DSN, start the API and hit an endpoint that raises (e.g. temporarily break
`FOLLOWOO_DATABASE_URL`, or add a throwaway route that raises) - the error
should appear in that Sentry project within a few seconds.

## Database Migrations (Alembic)

Schema changes to the Neon Postgres database are tracked with
[Alembic](https://alembic.sqlalchemy.org/) under `backend/alembic/`.
`alembic/env.py` reads `FOLLOWOO_DATABASE_URL` through the same
`app.db.get_settings()` the FastAPI app itself uses (from `.env` locally,
from the real environment variable in deploy) - there is no separate
migrations database config to keep in sync.

`backend/alembic/schema.py` defines the tables with plain SQLAlchemy Core
(`sa.Table`), used only so `alembic revision --autogenerate` has something
to diff against. This does not make the app use an ORM: `app/` still reads
and writes rows with `psycopg` directly (see
`app/updates/repository.py`). If you add a table or column the app should
read/write, add it to `app/updates/repository.py` (or a new feature's
`repository.py`) as usual, and mirror the same shape in
`alembic/schema.py` so autogenerate can see it.

Run every Alembic command from `backend/` with the venv active.

### Generating a migration

After changing `alembic/schema.py` to match a schema change you want to
make:

```bash
./.venv/bin/alembic revision --autogenerate -m "add xyz column to updates"
```

Alembic connects to whatever `FOLLOWOO_DATABASE_URL` currently points at
(your local `.env`) to diff the live schema against `alembic/schema.py`,
then writes a new file under `alembic/versions/`. Always read the
generated file before committing it - autogenerate is a starting point,
not a guarantee, especially for renames (it will generate a drop + add
instead) or anything Alembic can't introspect (check constraints, some
defaults).

### Applying migrations locally

Against a local/test Postgres database:

```bash
./.venv/bin/alembic upgrade head
```

Useful companions while developing:

```bash
./.venv/bin/alembic current   # what revision the DB is on
./.venv/bin/alembic history   # list all revisions
./.venv/bin/alembic downgrade -1   # undo the last migration
```

### Applying migrations in deploy

The very first migration (`baseline: create updates table`) is special:
it describes the `updates` table as it already exists in the real Neon
database (reconstructed from `app/updates/repository.py`, since the table
predates any migration tooling). Running it as a normal `upgrade` against
that database would fail (or duplicate the table) because the table is
already there. Instead, mark it as already applied without running its
SQL:

```bash
./.venv/bin/alembic stamp head
```

Run this once, manually, against the production database before the
first real deploy that includes Alembic. From then on, every deploy
should run:

```bash
./.venv/bin/alembic upgrade head
```

which applies any migrations newer than whatever revision the database is
currently stamped at. This is safe to run on every deploy: if the
database is already at `head`, it is a no-op.

A fresh database (a new local/test/staging environment that never had the
`updates` table) should always use `alembic upgrade head` from the start,
never `stamp` - `stamp` only makes sense for the one database that
already had the table before Alembic existed.
