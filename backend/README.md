# Followoo API

Python API for Followoo server-side features.

## Local Development

Create `backend/.env` with:

```txt
FOLLOWOO_DATABASE_URL="postgresql://..."
FOLLOWOO_CORS_ORIGINS="http://localhost:5173,http://127.0.0.1:5173"
```

In production, configure `FOLLOWOO_CORS_ORIGINS` on the backend host with the
public frontend origins:

```txt
FOLLOWOO_CORS_ORIGINS="https://followoo.app,https://www.followoo.app"
```

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
