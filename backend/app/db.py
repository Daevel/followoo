from functools import lru_cache
from typing import Any

from psycopg import Connection, connect
from psycopg.rows import dict_row
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    followoo_database_url: str

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()  # type: ignore[call-arg]


def get_connection() -> Connection[dict[str, Any]]:
    settings = get_settings()

    return connect(settings.followoo_database_url, row_factory=dict_row)
