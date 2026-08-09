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

Use this structure as the baseline:

```txt
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── db.py
│   └── updates/
│       ├── __init__.py
│       ├── router.py
│       ├── service.py
│       └── repository.py
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

## Configuration And Environment

Use environment variables for deploy/runtime configuration.

Current variables:

```txt
FOLLOWOO_DATABASE_URL="postgresql://..."
FOLLOWOO_CORS_ORIGINS="http://localhost:5173,https://followoo.app"
```

Rules:

- Never commit `.env` files or secrets.
- Keep local examples in documentation with placeholder values only.
- Prefer `pydantic-settings` for typed settings.
- Keep defaults safe for local development only.
- Do not hardcode production database URLs, API keys, or tokens.

## Database Rules

The backend currently uses Postgres/Neon through `psycopg`.

Rules:

- Keep SQL in repositories.
- Use parameterized queries for any user-provided input.
- For read-only public endpoints, return only fields needed by the frontend.
- Convert `date` and `datetime` values to ISO strings when necessary.
- Avoid logging raw row payloads if they could contain private data.
- Do not introduce ORM abstractions until there is a concrete need.

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
pydantic-settings
python-dotenv
```

Development dependencies currently used:

```txt
ruff
mypy
pytest
```

Before adding a dependency, prefer the standard library if it keeps the code clear. Add a package only when it removes real complexity or provides a capability that should not be implemented locally.

## Verification

Run backend checks from `backend/` using the virtual environment:

```bash
./.venv/bin/python -m ruff check app
./.venv/bin/python -m mypy app
./.venv/bin/python -m compileall app
```

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

When the backend grows beyond one or two endpoints, introduce structure incrementally:

```txt
backend/app/core/       -> shared settings, app config, errors if needed
backend/app/db.py       -> database connection until it becomes too broad
backend/app/<feature>/  -> feature router/service/repository/schemas
backend/tests/          -> pytest tests mirroring app features
```

Do not create `core/`, `common/`, or `utils/` folders preemptively. Add them only when there are multiple real call sites.

Potential future features:

- `updates` for public release notes;
- `admin_updates` for authenticated content management;
- `health` or `system` for operational checks;
- `support` only if the existing frontend support flow moves server-side.

## Deployment Notes

Before deployment, confirm:

- Python runtime/version matches `pyproject.toml`;
- `FOLLOWOO_DATABASE_URL` is set in the backend host;
- `FOLLOWOO_CORS_ORIGINS` includes the production frontend domain;
- frontend `VITE_API_BASE_URL` points to the deployed Python API;
- `/health` and `/updates` respond successfully;
- no secrets are committed.

Keep deployment docs in `backend/README.md` until a broader docs structure is needed.
