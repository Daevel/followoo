from app.sync.repository import (
    get_sync_keys,
    insert_sync_keys,
    update_passphrase_wrap,
)
from app.users.repository import get_or_create_user

_KDF_PARAMS = {
    "algorithm": "PBKDF2",
    "hash": "SHA-256",
    "iterations": 600_000,
    "iv": "aXY=",
}


def _activate(user_id: str) -> None:
    get_or_create_user(user_id, None)
    insert_sync_keys(
        user_id,
        "wrapped-passphrase-v1",
        "salt-passphrase",
        _KDF_PARAMS,
        "wrapped-recovery-v1",
        "salt-recovery",
        _KDF_PARAMS,
    )


def test_get_sync_keys_returns_none_when_never_activated() -> None:
    get_or_create_user("user_sync_repo_inactive", None)

    assert get_sync_keys("user_sync_repo_inactive") is None


def test_insert_sync_keys_persists_all_fields() -> None:
    _activate("user_sync_repo_insert")

    keys = get_sync_keys("user_sync_repo_insert")

    assert keys is not None
    assert keys["user_id"] == "user_sync_repo_insert"
    assert keys["wrapped_master_key_passphrase"] == "wrapped-passphrase-v1"
    assert keys["kdf_salt_passphrase"] == "salt-passphrase"
    assert keys["kdf_params_passphrase"] == _KDF_PARAMS
    assert keys["wrapped_master_key_recovery"] == "wrapped-recovery-v1"
    assert keys["kdf_salt_recovery"] == "salt-recovery"
    assert keys["kdf_params_recovery"] == _KDF_PARAMS


def test_update_passphrase_wrap_only_overwrites_the_passphrase_half() -> None:
    _activate("user_sync_repo_rotate")

    new_kdf_params = {**_KDF_PARAMS, "iterations": 700_000}
    updated = update_passphrase_wrap(
        "user_sync_repo_rotate",
        "wrapped-passphrase-v2",
        "salt-passphrase-v2",
        new_kdf_params,
    )

    assert updated is not None
    assert updated["wrapped_master_key_passphrase"] == "wrapped-passphrase-v2"
    assert updated["kdf_salt_passphrase"] == "salt-passphrase-v2"
    assert updated["kdf_params_passphrase"] == new_kdf_params
    # Untouched - rotating the passphrase wrap must never affect recovery.
    assert updated["wrapped_master_key_recovery"] == "wrapped-recovery-v1"
    assert updated["kdf_salt_recovery"] == "salt-recovery"
    assert updated["kdf_params_recovery"] == _KDF_PARAMS


def test_update_passphrase_wrap_returns_none_when_never_activated() -> None:
    get_or_create_user("user_sync_repo_rotate_inactive", None)

    updated = update_passphrase_wrap(
        "user_sync_repo_rotate_inactive",
        "wrapped-passphrase-v2",
        "salt-passphrase-v2",
        _KDF_PARAMS,
    )

    assert updated is None
