"""Fixtures shared by tests/snapshots/ only.

Mirrors tests/sync/conftest.py: everything here needs a real Postgres
database with migrations applied (FOLLOWOO_DATABASE_URL). get_pool() is a
process-wide singleton (see app/db.py's @lru_cache), so open()/close() here
are safe alongside the other test directories' own session-scoped fixtures
doing the same thing - both are idempotent.
"""

from collections.abc import Iterator

import pytest

from app.db import get_connection, get_pool


@pytest.fixture(scope="session", autouse=True)
def _database_pool() -> Iterator[None]:
    pool = get_pool()
    pool.open()
    yield
    pool.close()


@pytest.fixture(autouse=True)
def _clean_snapshots_tables() -> Iterator[None]:
    yield

    with get_connection() as connection, connection.cursor() as cursor:
        cursor.execute("TRUNCATE analysis_snapshots, users CASCADE")
