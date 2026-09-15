from collections.abc import Iterator
from contextlib import contextmanager
from functools import lru_cache

from psycopg import Connection
from psycopg.rows import DictRow, dict_row
from psycopg_pool import ConnectionPool
from pydantic_settings import BaseSettings, SettingsConfigDict

_MIN_POOL_SIZE = 1
_MAX_POOL_SIZE = 5


class Settings(BaseSettings):
    followoo_database_url: str

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()  # type: ignore[call-arg]


@lru_cache
def get_pool() -> ConnectionPool[Connection[DictRow]]:
    settings = get_settings()

    return ConnectionPool(
        settings.followoo_database_url,
        min_size=_MIN_POOL_SIZE,
        max_size=_MAX_POOL_SIZE,
        kwargs={"row_factory": dict_row},
        open=False,
    )


@contextmanager
def get_connection() -> Iterator[Connection[DictRow]]:
    """Borrow a pooled connection.

    Kept as a context manager so existing call sites
    (`with get_connection() as connection, connection.cursor() as cursor:`)
    do not need to change: this now returns the connection to the pool on
    exit instead of closing it, but commit/rollback-on-exit behaves the
    same as the plain `psycopg.connect()` this replaced.
    """
    with get_pool().connection() as connection:
        yield connection
