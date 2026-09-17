from datetime import datetime
from typing import Any, TypedDict, cast

from psycopg.types.json import Jsonb

from app.db import get_connection


class User(TypedDict):
    id: str
    email: str | None
    created_at: datetime


def get_or_create_user(user_id: str, email: str | None) -> User:
    """Lazily provision a user row from a verified Clerk JWT.

    No dedicated Clerk webhook exists (or is planned) for this - the first
    verified request from a given `sub` is what creates the row. Re-running
    this for an existing user updates `email` only when a non-null value is
    supplied, so a token that happens to omit the email claim never wipes
    out a previously known one.
    """
    query = """
        INSERT INTO users (id, email)
        VALUES (%s, %s)
        ON CONFLICT (id) DO UPDATE SET
          email = COALESCE(EXCLUDED.email, users.email)
        RETURNING id, email, created_at
    """

    with get_connection() as connection, connection.cursor() as cursor:
        cursor.execute(query, (user_id, email))
        row = cast(dict[str, Any], cursor.fetchone())

    return User(id=row["id"], email=row["email"], created_at=row["created_at"])


def get_active_subscription_status(user_id: str) -> str | None:
    """Most relevant subscription status for entitlement purposes.

    Returns None when the user has no subscription row at all (the case
    for every user until Task 3 starts writing Stripe webhook data here),
    or when none of their rows are active/trialing.
    """
    query = """
        SELECT status
        FROM subscriptions
        WHERE user_id = %s AND status IN ('active', 'trialing')
        ORDER BY current_period_end DESC NULLS LAST
        LIMIT 1
    """

    with get_connection() as connection, connection.cursor() as cursor:
        cursor.execute(query, (user_id,))
        row = cursor.fetchone()

    return cast(str, row["status"]) if row else None


def insert_usage_event(
    user_id: str, event_type: str, metadata: dict[str, object] | None
) -> None:
    query = """
        INSERT INTO usage_events (user_id, event_type, metadata)
        VALUES (%s, %s, %s)
    """

    with get_connection() as connection, connection.cursor() as cursor:
        cursor.execute(
            query,
            (user_id, event_type, Jsonb(metadata) if metadata is not None else None),
        )
