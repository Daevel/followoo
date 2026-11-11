from fastapi import APIRouter, Depends, HTTPException, Request

from app.auth.clerk import get_current_clerk_user_id
from app.core.limiter import PUBLIC_RATE_LIMIT, limiter
from app.sync import service
from app.sync.repository import SyncKeys
from app.sync.schemas import ActivateSyncRequest, RotatePassphraseRequest
from app.users.service import get_or_create_user

router = APIRouter(tags=["sync"])


def _credentials_response(keys: SyncKeys) -> dict[str, object]:
    return {
        "active": True,
        "wrapped_master_key_passphrase": keys["wrapped_master_key_passphrase"],
        "kdf_salt_passphrase": keys["kdf_salt_passphrase"],
        "kdf_params_passphrase": keys["kdf_params_passphrase"],
        "wrapped_master_key_recovery": keys["wrapped_master_key_recovery"],
        "kdf_salt_recovery": keys["kdf_salt_recovery"],
        "kdf_params_recovery": keys["kdf_params_recovery"],
    }


@router.post("/sync/activate", status_code=201)
@limiter.limit(PUBLIC_RATE_LIMIT)
def activate_sync(
    request: Request,
    body: ActivateSyncRequest,
    user_id: str = Depends(get_current_clerk_user_id),
) -> dict[str, object]:
    # Provision defensively, same reasoning as users/router.py's
    # create_usage_event: a signed-in user's very first backend call
    # could plausibly be this endpoint, and sync_keys.user_id has a
    # foreign key into users.
    get_or_create_user(user_id, None)

    try:
        keys = service.activate(
            user_id,
            body.wrapped_master_key_passphrase,
            body.kdf_salt_passphrase,
            body.kdf_params_passphrase.model_dump(),
            body.wrapped_master_key_recovery,
            body.kdf_salt_recovery,
            body.kdf_params_recovery.model_dump(),
        )
    except service.SyncAlreadyActiveError as error:
        raise HTTPException(
            status_code=409,
            detail={
                "code": "SYNC_ALREADY_ACTIVE",
                "message": "Encrypted history is already active for this account.",
            },
        ) from error

    return _credentials_response(keys)


@router.get("/sync/credentials")
@limiter.limit(PUBLIC_RATE_LIMIT)
def get_sync_credentials(
    request: Request,
    user_id: str = Depends(get_current_clerk_user_id),
) -> dict[str, object]:
    keys = service.get_credentials(user_id)

    if keys is None:
        return {"active": False}

    return _credentials_response(keys)


@router.post("/sync/rotate-passphrase")
@limiter.limit(PUBLIC_RATE_LIMIT)
def rotate_passphrase(
    request: Request,
    body: RotatePassphraseRequest,
    user_id: str = Depends(get_current_clerk_user_id),
) -> dict[str, object]:
    try:
        keys = service.rotate_passphrase(
            user_id,
            body.wrapped_master_key_passphrase,
            body.kdf_salt_passphrase,
            body.kdf_params_passphrase.model_dump(),
        )
    except service.SyncNotActiveError as error:
        raise HTTPException(
            status_code=404,
            detail={
                "code": "SYNC_NOT_ACTIVE",
                "message": "Encrypted history has not been activated for this account.",
            },
        ) from error

    return _credentials_response(keys)
