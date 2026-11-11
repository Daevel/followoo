from typing import Any

from app.sync.repository import (
    SyncKeys,
    get_sync_keys,
    insert_sync_keys,
    update_passphrase_wrap,
)


class SyncAlreadyActiveError(Exception):
    """Raised by `activate` when the caller already has a sync_keys row.

    The client must use rotate_passphrase instead of re-activating - this
    task does not support multiple concurrent key sets per user.
    """


class SyncNotActiveError(Exception):
    """Raised by `rotate_passphrase` when the caller has never activated."""


def activate(
    user_id: str,
    wrapped_master_key_passphrase: str,
    kdf_salt_passphrase: str,
    kdf_params_passphrase: dict[str, Any],
    wrapped_master_key_recovery: str,
    kdf_salt_recovery: str,
    kdf_params_recovery: dict[str, Any],
) -> SyncKeys:
    if get_sync_keys(user_id) is not None:
        raise SyncAlreadyActiveError

    return insert_sync_keys(
        user_id,
        wrapped_master_key_passphrase,
        kdf_salt_passphrase,
        kdf_params_passphrase,
        wrapped_master_key_recovery,
        kdf_salt_recovery,
        kdf_params_recovery,
    )


def get_credentials(user_id: str) -> SyncKeys | None:
    return get_sync_keys(user_id)


def rotate_passphrase(
    user_id: str,
    wrapped_master_key_passphrase: str,
    kdf_salt_passphrase: str,
    kdf_params_passphrase: dict[str, Any],
) -> SyncKeys:
    updated = update_passphrase_wrap(
        user_id,
        wrapped_master_key_passphrase,
        kdf_salt_passphrase,
        kdf_params_passphrase,
    )

    if updated is None:
        raise SyncNotActiveError

    return updated
