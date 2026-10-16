from app.snapshots.repository import (
    delete_snapshot,
    get_snapshot,
    insert_snapshot,
    list_snapshots,
)
from app.users.repository import get_or_create_user


def test_insert_snapshot_returns_id_and_created_at() -> None:
    get_or_create_user("user_snap_repo_insert", None)

    snapshot = insert_snapshot("user_snap_repo_insert", "ciphertext-1", "iv-1")

    assert snapshot["id"] is not None
    assert snapshot["created_at"] is not None


def test_list_snapshots_orders_newest_first_and_respects_limit_offset() -> None:
    get_or_create_user("user_snap_repo_list", None)

    first = insert_snapshot("user_snap_repo_list", "ciphertext-1", "iv-1")
    second = insert_snapshot("user_snap_repo_list", "ciphertext-2", "iv-2")
    third = insert_snapshot("user_snap_repo_list", "ciphertext-3", "iv-3")

    all_items = list_snapshots("user_snap_repo_list", limit=50, offset=0)
    assert [item["id"] for item in all_items] == [
        third["id"],
        second["id"],
        first["id"],
    ]

    paged = list_snapshots("user_snap_repo_list", limit=1, offset=1)
    assert [item["id"] for item in paged] == [second["id"]]


def test_list_snapshots_is_scoped_to_the_user() -> None:
    get_or_create_user("user_snap_repo_a", None)
    get_or_create_user("user_snap_repo_b", None)

    insert_snapshot("user_snap_repo_a", "ciphertext-a", "iv-a")

    assert list_snapshots("user_snap_repo_b", limit=50, offset=0) == []


def test_get_snapshot_returns_full_row_for_the_owner() -> None:
    get_or_create_user("user_snap_repo_get", None)
    created = insert_snapshot("user_snap_repo_get", "ciphertext-x", "iv-x")

    snapshot = get_snapshot("user_snap_repo_get", str(created["id"]))

    assert snapshot is not None
    assert snapshot["encrypted_blob"] == "ciphertext-x"
    assert snapshot["iv"] == "iv-x"
    assert snapshot["schema_version"] == 1


def test_get_snapshot_returns_none_for_another_user() -> None:
    get_or_create_user("user_snap_repo_owner", None)
    get_or_create_user("user_snap_repo_other", None)
    created = insert_snapshot("user_snap_repo_owner", "ciphertext-y", "iv-y")

    assert get_snapshot("user_snap_repo_other", str(created["id"])) is None


def test_delete_snapshot_removes_own_row_and_reports_success() -> None:
    get_or_create_user("user_snap_repo_delete", None)
    created = insert_snapshot("user_snap_repo_delete", "ciphertext-z", "iv-z")

    assert delete_snapshot("user_snap_repo_delete", str(created["id"])) is True
    assert get_snapshot("user_snap_repo_delete", str(created["id"])) is None


def test_delete_snapshot_does_not_remove_another_users_row() -> None:
    get_or_create_user("user_snap_repo_owner2", None)
    get_or_create_user("user_snap_repo_attacker", None)
    created = insert_snapshot("user_snap_repo_owner2", "ciphertext-w", "iv-w")

    assert delete_snapshot("user_snap_repo_attacker", str(created["id"])) is False
    assert get_snapshot("user_snap_repo_owner2", str(created["id"])) is not None
