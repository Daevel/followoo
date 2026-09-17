---
name: python-backend
description: Followoo Python backend, FastAPI, backend/, endpoints, routers, services, repositories, database access, CORS, Pydantic, and Python verification. Use when creating, refactoring, debugging, deploying, or maintaining the Python API under backend/.
---

# Python Backend - Followoo

## Purpose

Use this skill when working on the Followoo Python backend under `backend/`.

This includes:

- creating or refactoring FastAPI endpoints;
- adding routers, services, repositories, schemas, or settings;
- changing database access to Neon/Postgres;
- changing CORS or API environment behavior;
- debugging backend startup, imports, dependency, or typing issues;
- preparing backend verification before commit or deploy.

The goal is to keep the Python backend small, explicit, testable, and ready to grow beyond the initial `updates` endpoint without turning into an unstructured API folder.

## Project Boundary

Followoo remains one repository with two application areas:

```txt
src/      -> React + Vite browser application
backend/  -> Python FastAPI backend
```

Do not reintroduce the old Node/Vercel serverless `api/` and `server/` layers for update retrieval unless the user explicitly asks to restore them.

The Python backend owns server-side public data endpoints such as release updates. It must not receive private Instagram ZIP exports, raw usernames, follower lists, or relationship analysis data unless the product privacy model is explicitly changed.

## Current Backend Structure

This is the actual current shape, not an aspiration:

```txt
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── db.py
│   ├── core/            -> limiter.py, sentry.py: shared cross-cutting setup
│   ├── auth/             -> clerk.py: Clerk JWT verification (no router - see app/users)
│   ├── users/             -> identity/entitlement: router, service, repository, schemas, dependencies
│   └── updates/
│       ├── __init__.py
│       ├── router.py
│       ├── service.py
│       └── repository.py
├── alembic/              -> schema migrations, see backend/README.md
├── tests/                -> pytest, mirrors app/ (tests/auth/, tests/users/, ...)
├── pyproject.toml
└── README.md
```

When adding new capabilities, prefer this feature-shaped pattern:

```txt
backend/app/<feature>/
├── __init__.py
├── router.py
├── service.py
├── repository.py
└── schemas.py
```

Only create files that are needed. For a simple read-only endpoint, `router.py`, `service.py`, and `repository.py` are often enough.

## Responsibility Rules

`main.py`:

- creates the `FastAPI` app;
- configures app-wide middleware such as CORS;
- registers routers;
- owns app-level health checks.

`db.py`:

- reads database settings;
- creates database connections;
- keeps driver-specific details out of endpoint routers.

`<feature>/router.py`:

- defines HTTP routes and status behavior;
- handles request/response boundaries;
- delegates business work to the service layer;
- does not contain SQL.

`<feature>/service.py`:

- coordinates feature behavior;
- stays thin when there is no real business logic;
- does not know FastAPI request objects unless there is a concrete reason.

`<feature>/repository.py`:

- owns SQL and database row mapping;
- maps database `snake_case` fields to public API shape when appropriate;
- does not raise user-facing HTTP errors directly.

`<feature>/schemas.py`:

- contains Pydantic models for request or response schemas when useful;
- should be introduced before response shapes become duplicated or complex.

## API Shape

Preserve frontend-facing response contracts unless the user asks for a breaking change.

The current updates endpoint response shape is:

```json
{
  "data": []
}
```

The frontend currently calls the Python backend through `src/lib/api.ts` and `VITE_API_BASE_URL`. Keep backend route changes coordinated with that helper and the consuming page or service.

Prefer stable public field names in camelCase for JSON responses consumed by the React app, even when database columns are snake_case.

## FastAPI Rules

- Use `APIRouter` per feature.
- Keep route paths explicit, such as `@router.get("/updates")`.
- Prefer synchronous routes for simple blocking `psycopg` database reads unless the backend is deliberately migrated to async DB access.
- Raise `HTTPException` in routers for HTTP boundary failures.
- Avoid leaking raw exception messages to clients.
- Keep `/health` cheap and independent from database connectivity unless a deep health check is explicitly needed.
- Rate limit every public endpoint except `/health` using the shared `slowapi` limiter in `app/core/limiter.py`: add `request: Request` as a parameter and decorate with `@limiter.limit(PUBLIC_RATE_LIMIT)` (see `app/updates/router.py`). When a backend-side support/contact endpoint is created, it must get this same decorator - it was intentionally skipped only because no such endpoint exists yet (the support form is still frontend-only, see `src/features/support`).
- When a router's `except Exception` turns a real error into an `HTTPException` (or otherwise handles/swallows it), call `sentry_sdk.capture_exception(error)` before raising - Sentry's automatic capture only sees truly unhandled exceptions, not ones already converted to an HTTP response (see `app/updates/router.py`). Never attach parsed row data, request bodies, or `AppError`-style `details` as extra Sentry context; see Error Tracking (Sentry) in `backend/README.md` for the full privacy rules `app/core/sentry.py` enforces.

## Configuration And Environment

Use environment variables for deploy/runtime configuration.

Current variables:

```txt
FOLLOWOO_DATABASE_URL="postgresql://..."
FOLLOWOO_CORS_ORIGINS="http://localhost:5173,https://followoo.app"
FOLLOWOO_SENTRY_DSN=""              # optional, Sentry disabled when unset
FOLLOWOO_ENVIRONMENT="development"  # optional, tags Sentry events
FOLLOWOO_CLERK_JWKS_URL=""          # required for any Clerk-protected route
```

Rules:

- Never commit `.env` files or secrets.
- Keep local examples in documentation with placeholder values only.
- Prefer `pydantic-settings` for typed settings.
- Keep defaults safe for local development only.
- Do not hardcode production database URLs, API keys, or tokens.

## Database Rules

The backend currently uses Postgres/Neon through `psycopg`, borrowing
connections from a `psycopg_pool.ConnectionPool` (`app/db.py`) instead of
opening a new connection per request. The pool is opened/closed via the
FastAPI `lifespan` in `app/main.py`, not on first use.

Rules:

- Keep SQL in repositories.
- Get connections through `app/db.py`'s `get_connection()` (still a
  context manager: `with get_connection() as connection, connection.cursor() as cursor:`),
  never call `psycopg.connect()` directly in a repository.
- Use parameterized queries for any user-provided input.
- For read-only public endpoints, return only fields needed by the frontend.
- Convert `date` and `datetime` values to ISO strings when necessary.
- Avoid logging raw row payloads if they could contain private data.
- Do not introduce ORM abstractions in application code until there is a
  concrete need; `alembic/schema.py` is the one sanctioned exception,
  using SQLAlchemy Core only for Alembic's own autogenerate diffing (see
  backend/README.md's Database Migrations section) - `app/` itself must
  keep using `psycopg` directly.

## Privacy Rules

The Python backend must not process private Instagram export data by default.

Allowed backend data:

- public updates/release notes;
- public product content;
- operational health checks;
- future admin or content workflows with explicit access control.

Disallowed without explicit product decision:

- uploaded Instagram ZIP archives;
- follower/following lists;
- usernames from user exports;
- relationship analysis results;
- private derived Instagram metrics.

The browser-side privacy promise remains: Instagram export analysis happens locally in the browser.

## Typing And Style

- Keep Python type hints on public functions.
- Prefer small functions over broad utility modules.
- Avoid global catch-all helpers unless reused by at least two features.
- Use `dict[str, object]` or Pydantic models for response boundaries.
- Add `__init__.py` for packages so `mypy` resolves modules consistently.
- Keep comments rare and useful.

## Dependency Rules

Runtime dependencies should stay minimal:

```txt
fastapi
uvicorn
psycopg[binary]
psycopg_pool
pydantic-settings
python-dotenv
slowapi
sentry-sdk
pyjwt[crypto]
alembic
sqlalchemy
```

`alembic` and `sqlalchemy` are for schema migrations only (see backend/README.md); `sqlalchemy` is not used as an ORM by `app/`. `slowapi` is the public-endpoint rate limiter (see FastAPI Rules above). `pyjwt[crypto]` is Clerk JWT verification (`app/auth/clerk.py`) - the `[crypto]` extra pulls in `cryptography`, required for RS256.

Development dependencies, declared in `pyproject.toml`'s `[project.optional-dependencies].dev`:

```txt
ruff
mypy
pytest
httpx    # required for fastapi.testclient.TestClient
```

Before adding a dependency, prefer the standard library if it keeps the code clear. Add a package only when it removes real complexity or provides a capability that should not be implemented locally.

## Verification

Run backend checks from `backend/` using the virtual environment:

```bash
./.venv/bin/python -m ruff check app tests
./.venv/bin/python -m mypy app
./.venv/bin/python -m mypy tests
```

Tests need a real Postgres: `tests/auth/` stubs the JWKS fetch and needs
none, but `tests/users/` exercises real SQL (upserts, JSONB) against
`FOLLOWOO_DATABASE_URL` with migrations applied
(`./.venv/bin/alembic upgrade head`), and can't be meaningfully faked with
a mocked connection.

```bash
./.venv/bin/python -m pytest
```

CI (`.github/workflows/ci.yml`'s `backend-verify` job) runs all of the
above against a `postgres:16` service container automatically - see
`docs/CI.md`.

When frontend integration changes, also run from the repo root:

```bash
npm run lint
npm run build
```

For local backend smoke tests:

```bash
./.venv/bin/python -m uvicorn app.main:app --reload --port 8000
```

Then verify:

```txt
http://localhost:8000/health
http://localhost:8000/updates
```

If testing CORS, use the frontend origin `http://localhost:5173`.

## Frontend Integration

The React app should not hardcode backend URLs in pages.

Use:

```txt
src/lib/api.ts
VITE_API_BASE_URL
```

Rules:

- Keep API URL construction centralized.
- Keep pages thin; move repeated API calls into services when more endpoints are added.
- Do not import backend Python files or server-only concepts into `src/`.
- Do not send private Instagram analysis data to Python endpoints.

## Growth Path

`backend/app/core/` (shared cross-cutting setup: limiter, Sentry),
`backend/app/<feature>/` (feature router/service/repository/schemas/
dependencies), and `backend/tests/` (pytest mirroring `app/`) already
exist - this is the pattern to keep following, not a future state.

Do not create `common/` or `utils/` folders preemptively. Add them only when there are multiple real call sites.

Existing features:

- `updates` - public release notes;
- `auth` - Clerk JWT verification (`clerk.py`; no router - other features' routers depend on it directly);
- `users` - user identity, Base/Pro entitlement, anonymous usage analytics (v3.0.0 Task 2).

Potential future features:

- `billing` - Stripe integration writing to `subscriptions` (v3.0.0 Task 3);
- `admin_updates` for authenticated content management;
- `health` or `system` for operational checks;
- `support` only if the existing frontend support flow moves server-side.

## Deployment Notes

Before deployment, confirm:

- Python runtime/version matches `pyproject.toml`;
- `FOLLOWOO_DATABASE_URL` is set in the backend host;
- `FOLLOWOO_CORS_ORIGINS` includes the production frontend domain;
- `FOLLOWOO_CLERK_JWKS_URL` is set (required for `/users/me`, `/usage-events`, and any other Clerk-protected route);
- pending Alembic migrations have been applied (`alembic upgrade head`, or `alembic stamp head` for the one-time baseline - see backend/README.md);
- frontend `VITE_API_BASE_URL` points to the deployed Python API;
- `/health` and `/updates` respond successfully;
- no secrets are committed.

Keep deployment docs in `backend/README.md` until a broader docs structure is needed.
