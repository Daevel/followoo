from fastapi import APIRouter, HTTPException

from app.updates.service import retrieve_published_updates

router = APIRouter(tags=["updates"])


@router.get("/updates")
def get_updates() -> dict[str, object]:
    try:
        return {"data": retrieve_published_updates()}
    except Exception as error:
        raise HTTPException(status_code=500, detail="Failed to load updates") from error
