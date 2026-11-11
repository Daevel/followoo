"""Fixtures shared by tests/users/ only.

Scoped to this directory deliberately: tests/auth/ stubs the JWKS fetch and
never touches a database, and must stay that way. Everything in this
directory does need a real Postgres database with migrations applied
(FOLLOWOO_DATABASE_URL) - the repository code here is raw SQL
(ON CONFLICT upserts, JSONB), which a mock connection couldn't prove
correct.
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
def _clean_users_tables() -> Iterator[None]:
    yield

    with get_connection() as connection, connection.cursor() as cursor:
        cursor.execute("TRUNCATE usage_events, subscriptions, users CASCADE")
