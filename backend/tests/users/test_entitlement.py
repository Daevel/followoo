from app.db import get_connection
from app.users.repository import get_or_create_user
from app.users.service import get_entitlement


def _insert_subscription(user_id: str, status: str | None) -> None:
    with get_connection() as connection, connection.cursor() as cursor:
        cursor.execute(
            "INSERT INTO subscriptions (user_id, status) VALUES (%s, %s)",
            (user_id, status),
        )


def test_get_entitlement_is_base_with_no_subscription_row() -> None:
    get_or_create_user("user_no_sub", None)

    assert get_entitlement("user_no_sub") == "base"


def test_get_entitlement_is_pro_with_active_subscription() -> None:
    get_or_create_user("user_active", None)
    _insert_subscription("user_active", "active")

    assert get_entitlement("user_active") == "pro"


def test_get_entitlement_is_pro_with_trialing_subscription() -> None:
    get_or_create_user("user_trialing", None)
    _insert_subscription("user_trialing", "trialing")

    assert get_entitlement("user_trialing") == "pro"


def test_get_entitlement_is_base_with_canceled_subscription() -> None:
    get_or_create_user("user_canceled", None)
    _insert_subscription("user_canceled", "canceled")

    assert get_entitlement("user_canceled") == "base"
