from uuid import UUID

from app.snapshots.repository import (
    Snapshot,
    SnapshotListItem,
    delete_snapshot,
    get_snapshot,
    insert_snapshot,
    list_snapshots,
)

DEFAULT_LIST_LIMIT = 50
MAX_LIST_LIMIT = 200


class SnapshotNotFoundError(Exception):
    """Raised when a snapshot id doesn't exist, or isn't owned by the caller.

    Both cases resolve to the same 404 - never reveal whether an id exists
    for a different user.
    """


def _is_valid_uuid(value: str) -> bool:
    try:
        UUID(value)
        return True
    except ValueError:
        return False


def create_snapshot(user_id: str, encrypted_blob: str, iv: str) -> SnapshotListItem:
    return insert_snapshot(user_id, encrypted_blob, iv)


def list_user_snapshots(
    user_id: str, limit: int, offset: int
) -> list[SnapshotListItem]:
    bounded_limit = max(1, min(limit, MAX_LIST_LIMIT))
    bounded_offset = max(0, offset)
    return list_snapshots(user_id, bounded_limit, bounded_offset)


def get_user_snapshot(user_id: str, snapshot_id: str) -> Snapshot:
    if not _is_valid_uuid(snapshot_id):
        raise SnapshotNotFoundError

    snapshot = get_snapshot(user_id, snapshot_id)

    if snapshot is None:
        raise SnapshotNotFoundError

    return snapshot


def delete_user_snapshot(user_id: str, snapshot_id: str) -> None:
    if not _is_valid_uuid(snapshot_id) or not delete_snapshot(user_id, snapshot_id):
        raise SnapshotNotFoundError
