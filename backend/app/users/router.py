from collections.abc import Mapping
from typing import Any

from fastapi import APIRouter, Depends, Request, Response

from app.auth.clerk import get_current_clerk_claims, get_current_clerk_user_id
from app.core.limiter import PUBLIC_RATE_LIMIT, limiter
from app.users import service
from app.users.schemas import UsageEventRequest

router = APIRouter(tags=["users"])


def _extract_email(claims: Mapping[str, Any]) -> str | None:
    # Clerk's default session token does not include an email claim; this
    # only resolves to a real value once the Clerk JWT template is
    # customized to add one (dashboard step, not required for this to
    # work - `users.email` is nullable and callers already treat it as
    # optional).
    email = claims.get("email")
    return email if isinstance(email, str) and email else None


@router.get("/users/me")
@limiter.limit(PUBLIC_RATE_LIMIT)
def get_me(
    request: Request,
    claims: Mapping[str, Any] = Depends(get_current_clerk_claims),
) -> dict[str, object]:
    user_id: str = claims["sub"]
    user = service.get_or_create_user(user_id, _extract_email(claims))
    plan = service.get_entitlement(user_id)

    return {"user_id": user["id"], "email": user["email"], "plan": plan}


@router.post("/usage-events", status_code=204)
@limiter.limit(PUBLIC_RATE_LIMIT)
def create_usage_event(
    request: Request,
    body: UsageEventRequest,
    user_id: str = Depends(get_current_clerk_user_id),
) -> Response:
    # Provision defensively: a signed-in user's very first backend call
    # could plausibly be this endpoint rather than GET /users/me (e.g. if
    # useCurrentUser never mounted on the page an analysis just completed
    # on), and usage_events.user_id has a foreign key into users.
    service.get_or_create_user(user_id, None)
    service.log_usage_event(user_id, body.event_type)
    return Response(status_code=204)
