from datetime import datetime
from typing import Any, TypedDict, cast

from psycopg.types.json import Jsonb

from app.db import get_connection

_SELECT_COLUMNS = """
    user_id, wrapped_master_key_passphrase, kdf_salt_passphrase,
    kdf_params_passphrase, wrapped_master_key_recovery, kdf_salt_recovery,
    kdf_params_recovery, created_at, updated_at
"""


class SyncKeys(TypedDict):
    user_id: str
    wrapped_master_key_passphrase: str
    kdf_salt_passphrase: str
    kdf_params_passphrase: dict[str, Any]
    wrapped_master_key_recovery: str
    kdf_salt_recovery: str
    kdf_params_recovery: dict[str, Any]
    created_at: datetime
    updated_at: datetime


def get_sync_keys(user_id: str) -> SyncKeys | None:
    query = f"SELECT {_SELECT_COLUMNS} FROM sync_keys WHERE user_id = %s"

    with get_connection() as connection, connection.cursor() as cursor:
        cursor.execute(query, (user_id,))
        row = cursor.fetchone()

    return cast(SyncKeys, row) if row is not None else None


def insert_sync_keys(
    user_id: str,
    wrapped_master_key_passphrase: str,
    kdf_salt_passphrase: str,
    kdf_params_passphrase: dict[str, Any],
    wrapped_master_key_recovery: str,
    kdf_salt_recovery: str,
    kdf_params_recovery: dict[str, Any],
) -> SyncKeys:
    query = f"""
        INSERT INTO sync_keys (
          user_id, wrapped_master_key_passphrase, kdf_salt_passphrase,
          kdf_params_passphrase, wrapped_master_key_recovery,
          kdf_salt_recovery, kdf_params_recovery
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        RETURNING {_SELECT_COLUMNS}
    """

    with get_connection() as connection, connection.cursor() as cursor:
        cursor.execute(
            query,
            (
                user_id,
                wrapped_master_key_passphrase,
                kdf_salt_passphrase,
                Jsonb(kdf_params_passphrase),
                wrapped_master_key_recovery,
                kdf_salt_recovery,
                Jsonb(kdf_params_recovery),
            ),
        )
        row = cast(dict[str, Any], cursor.fetchone())

    return cast(SyncKeys, row)


def update_passphrase_wrap(
    user_id: str,
    wrapped_master_key_passphrase: str,
    kdf_salt_passphrase: str,
    kdf_params_passphrase: dict[str, Any],
) -> SyncKeys | None:
    """Overwrite only the passphrase-wrapped half of an existing row.

    Never touches the recovery-wrapped half: this is specifically the
    "I have my recovery code but forgot my passphrase" path, and the
    recovery wrap must keep working unchanged afterwards.
    """
    query = f"""
        UPDATE sync_keys
        SET wrapped_master_key_passphrase = %s,
            kdf_salt_passphrase = %s,
            kdf_params_passphrase = %s,
            updated_at = now()
        WHERE user_id = %s
        RETURNING {_SELECT_COLUMNS}
    """

    with get_connection() as connection, connection.cursor() as cursor:
        cursor.execute(
            query,
            (
                wrapped_master_key_passphrase,
                kdf_salt_passphrase,
                Jsonb(kdf_params_passphrase),
                user_id,
            ),
        )
        row = cursor.fetchone()

    return cast(SyncKeys, row) if row is not None else None
