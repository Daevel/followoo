from typing import Literal

from app.users.repository import (
    User,
    get_active_subscription_status,
    insert_usage_event,
)
from app.users.repository import (
    get_or_create_user as _get_or_create_user,
)

Entitlement = Literal["base", "pro"]

# Statuses that count as an active paid plan. Deliberately not "every
# non-null status": e.g. "past_due" or "canceled" must resolve to "base".
_PRO_STATUSES = {"active", "trialing"}


def get_or_create_user(user_id: str, email: str | None) -> User:
    return _get_or_create_user(user_id, email)


def get_entitlement(user_id: str) -> Entitlement:
    """Base vs Pro, derived from `subscriptions` - never a stored `plan`
    field on `users`, so this can never drift from what Stripe (Task 3)
    actually reports. Every user resolves to "base" until a subscription
    row with an active/trialing status exists, which is the case for
    everyone today - not a bug, subscriptions is intentionally empty.
    """
    status = get_active_subscription_status(user_id)
    return "pro" if status in _PRO_STATUSES else "base"


def log_usage_event(
    user_id: str, event_type: str, metadata: dict[str, object] | None = None
) -> None:
    insert_usage_event(user_id, event_type, metadata)
