from fastapi import APIRouter, Depends, HTTPException, Query, Request, Response

from app.auth.clerk import get_current_clerk_user_id
from app.core.limiter import PUBLIC_RATE_LIMIT, limiter
from app.snapshots import service
from app.snapshots.schemas import CreateSnapshotRequest
from app.users.service import get_or_create_user

router = APIRouter(tags=["snapshots"])


def _not_found() -> HTTPException:
    return HTTPException(
        status_code=404,
        detail={
            "code": "SNAPSHOT_NOT_FOUND",
            "message": "This history entry does not exist.",
        },
    )


@router.post("/snapshots", status_code=201)
@limiter.limit(PUBLIC_RATE_LIMIT)
def create_snapshot(
    request: Request,
    body: CreateSnapshotRequest,
    user_id: str = Depends(get_current_clerk_user_id),
) -> dict[str, object]:
    # Provisioning defensively, same reasoning as app/sync/router.py's
    # activate_sync: in practice the user already has a row by the time
    # they've activated sync, but this endpoint shouldn't rely on that.
    get_or_create_user(user_id, None)

    snapshot = service.create_snapshot(user_id, body.encrypted_blob, body.iv)
    return {"id": str(snapshot["id"]), "created_at": snapshot["created_at"]}


@router.get("/snapshots")
@limiter.limit(PUBLIC_RATE_LIMIT)
def list_snapshots(
    request: Request,
    limit: int = Query(default=service.DEFAULT_LIST_LIMIT, ge=1),
    offset: int = Query(default=0, ge=0),
    user_id: str = Depends(get_current_clerk_user_id),
) -> list[dict[str, object]]:
    snapshots = service.list_user_snapshots(user_id, limit, offset)
    return [
        {"id": str(item["id"]), "created_at": item["created_at"]}
        for item in snapshots
    ]


@router.get("/snapshots/{snapshot_id}")
@limiter.limit(PUBLIC_RATE_LIMIT)
def get_snapshot(
    request: Request,
    snapshot_id: str,
    user_id: str = Depends(get_current_clerk_user_id),
) -> dict[str, object]:
    try:
        snapshot = service.get_user_snapshot(user_id, snapshot_id)
    except service.SnapshotNotFoundError as error:
        raise _not_found() from error

    return {
        "id": str(snapshot["id"]),
        "created_at": snapshot["created_at"],
        "encrypted_blob": snapshot["encrypted_blob"],
        "iv": snapshot["iv"],
    }


@router.delete("/snapshots/{snapshot_id}", status_code=204)
@limiter.limit(PUBLIC_RATE_LIMIT)
def delete_snapshot(
    request: Request,
    snapshot_id: str,
    user_id: str = Depends(get_current_clerk_user_id),
) -> Response:
    try:
        service.delete_user_snapshot(user_id, snapshot_id)
    except service.SnapshotNotFoundError as error:
        raise _not_found() from error

    return Response(status_code=204)
