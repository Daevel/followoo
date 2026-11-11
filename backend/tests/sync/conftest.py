"""Fixtures shared by tests/sync/ only.

Mirrors tests/users/conftest.py: everything here needs a real Postgres
database with migrations applied (FOLLOWOO_DATABASE_URL), since
app/sync/repository.py is raw SQL. get_pool() is a process-wide singleton
(see app/db.py's @lru_cache), so open()/close() here are safe alongside
tests/users/conftest.py's own session-scoped fixture doing the same thing -
both are idempotent and only ever run once per real action.
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
def _clean_sync_tables() -> Iterator[None]:
    yield

    with get_connection() as connection, connection.cursor() as cursor:
        cursor.execute("TRUNCATE sync_keys, users CASCADE")
