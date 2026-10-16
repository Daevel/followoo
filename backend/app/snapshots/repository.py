from datetime import datetime
from typing import Any, TypedDict, cast

from app.db import get_connection

_SCHEMA_VERSION = 1


class SnapshotListItem(TypedDict):
    id: str
    created_at: datetime


class Snapshot(SnapshotListItem):
    encrypted_blob: str
    iv: str
    schema_version: int


def insert_snapshot(user_id: str, encrypted_blob: str, iv: str) -> SnapshotListItem:
    query = """
        INSERT INTO analysis_snapshots (user_id, encrypted_blob, iv, schema_version)
        VALUES (%s, %s, %s, %s)
        RETURNING id, created_at
    """

    with get_connection() as connection, connection.cursor() as cursor:
        cursor.execute(query, (user_id, encrypted_blob, iv, _SCHEMA_VERSION))
        row = cast(dict[str, Any], cursor.fetchone())

    return cast(SnapshotListItem, row)


def list_snapshots(
    user_id: str, limit: int, offset: int
) -> list[SnapshotListItem]:
    query = """
        SELECT id, created_at
        FROM analysis_snapshots
        WHERE user_id = %s
        ORDER BY created_at DESC
        LIMIT %s OFFSET %s
    """

    with get_connection() as connection, connection.cursor() as cursor:
        cursor.execute(query, (user_id, limit, offset))
        rows = cursor.fetchall()

    return cast(list[SnapshotListItem], rows)


def get_snapshot(user_id: str, snapshot_id: str) -> Snapshot | None:
    query = """
        SELECT id, created_at, encrypted_blob, iv, schema_version
        FROM analysis_snapshots
        WHERE id = %s AND user_id = %s
    """

    with get_connection() as connection, connection.cursor() as cursor:
        cursor.execute(query, (snapshot_id, user_id))
        row = cursor.fetchone()

    return cast(Snapshot, row) if row is not None else None


def delete_snapshot(user_id: str, snapshot_id: str) -> bool:
    """Returns whether a row was actually deleted (false => not found/not owned)."""
    query = """
        DELETE FROM analysis_snapshots
        WHERE id = %s AND user_id = %s
    """

    with get_connection() as connection, connection.cursor() as cursor:
        cursor.execute(query, (snapshot_id, user_id))
        deleted_count = cursor.rowcount

    return deleted_count > 0
