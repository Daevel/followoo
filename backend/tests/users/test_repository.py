from app.db import get_connection
from app.users.repository import get_or_create_user


def _count_users(user_id: str) -> int:
    with get_connection() as connection, connection.cursor() as cursor:
        cursor.execute("SELECT count(*) AS n FROM users WHERE id = %s", (user_id,))
        row = cursor.fetchone()

    assert row is not None
    return row["n"]


def test_get_or_create_user_creates_when_absent() -> None:
    user = get_or_create_user("user_new", "new@example.com")

    assert user["id"] == "user_new"
    assert user["email"] == "new@example.com"
    assert _count_users("user_new") == 1


def test_get_or_create_user_does_not_duplicate_existing_row() -> None:
    first = get_or_create_user("user_repeat", "first@example.com")
    second = get_or_create_user("user_repeat", "first@example.com")

    assert first["id"] == second["id"]
    assert first["created_at"] == second["created_at"]
    assert _count_users("user_repeat") == 1


def test_get_or_create_user_keeps_existing_email_when_new_call_omits_it() -> None:
    get_or_create_user("user_keep_email", "keep@example.com")

    updated = get_or_create_user("user_keep_email", None)

    assert updated["email"] == "keep@example.com"
