# Followoo API

Python API for Followoo server-side features.

## Local Development

Create `backend/.env` with:

```txt
FOLLOWOO_DATABASE_URL="postgresql://..."
FOLLOWOO_CORS_ORIGINS="http://localhost:5173,http://127.0.0.1:5173"
FOLLOWOO_SENTRY_DSN=""
FOLLOWOO_ENVIRONMENT="development"
```

`FOLLOWOO_SENTRY_DSN` and `FOLLOWOO_ENVIRONMENT` are optional - see
[Error Tracking (Sentry)](#error-tracking-sentry) below. Never commit a real
DSN; leave it unset/empty locally unless you are deliberately testing
against your own Sentry project.

In production, configure `FOLLOWOO_CORS_ORIGINS` on the backend host with the
public frontend origins:

```txt
FOLLOWOO_CORS_ORIGINS="https://followoo.app,https://www.followoo.app"
```

### Preview environment

Besides the production service, a second Render service exists (or is being
set up) tracking the `preview` branch instead of `main`, with its own
environment variables:

```txt
FOLLOWOO_DATABASE_URL="<preview Neon branch connection string - not the production database>"
FOLLOWOO_CORS_ORIGINS="<the preview Vercel deployment's origin, e.g. https://followoo-git-preview-<team>.vercel.app - verify the exact URL once that deployment exists>"
FOLLOWOO_ENVIRONMENT="preview"
```

Exact URLs and values are placeholders above and still need to be filled in
once the preview Render service has been created from the dashboard - see
the repo root `AGENTS.md` "Environments" note for the overall `main` vs
`preview` flow.

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

## Database Connections

`app/db.py` keeps a `psycopg_pool.ConnectionPool` (min 1, max 5 connections)
instead of opening a new Postgres connection per request. The pool is opened
on app startup and closed on shutdown via the FastAPI `lifespan` in
`app/main.py`. Repositories still use `get_connection()` as a context
manager exactly as before
(`with get_connection() as connection, connection.cursor() as cursor:`) -
it now borrows/returns a pooled connection instead of opening/closing one.

## Rate Limiting

Public GET endpoints (currently `/updates`) are rate limited per client IP
with `slowapi` at 30 requests/minute, using the shared limiter in
`app/core/limiter.py`. Exceeding the limit returns `429` with a JSON body.
`/health` is intentionally not rate limited so uptime checks stay cheap and
reliable. When a backend-side support/contact endpoint is added, apply the
same `@limiter.limit(PUBLIC_RATE_LIMIT)` decorator to it - it does not exist
in the backend yet (the support form is still frontend-only).

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
