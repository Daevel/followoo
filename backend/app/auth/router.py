from fastapi import APIRouter, Depends, Request

from app.auth.clerk import get_current_clerk_user_id
from app.core.limiter import PUBLIC_RATE_LIMIT, limiter

router = APIRouter(tags=["auth"])


@router.get("/auth/me")
@limiter.limit(PUBLIC_RATE_LIMIT)
def get_current_user(
    request: Request,
    user_id: str = Depends(get_current_clerk_user_id),
) -> dict[str, str]:
    """Temporary end-to-end verification endpoint for v3.0.0 Task 1.

    Only proves the Clerk login -> JWT -> backend verification chain
    works. v3.0.0 Task 2 replaces this with real endpoints backed by
    persisted users/entitlements - do not build permanent UI on top of it.
    """
    return {"user_id": user_id}
