import sentry_sdk
from fastapi import APIRouter, HTTPException, Request

from app.core.limiter import PUBLIC_RATE_LIMIT, limiter
from app.updates.service import retrieve_published_updates

router = APIRouter(tags=["updates"])


@router.get("/updates")
@limiter.limit(PUBLIC_RATE_LIMIT)
def get_updates(request: Request) -> dict[str, object]:
    try:
        return {"data": retrieve_published_updates()}
    except Exception as error:
        # Captured explicitly: this except turns the error into a handled
        # HTTPException, so Sentry's automatic unhandled-exception capture
        # would never see it otherwise (it would just be lost, only
        # visible as an opaque 500 to the client).
        sentry_sdk.capture_exception(error)
        raise HTTPException(status_code=500, detail="Failed to load updates") from error
