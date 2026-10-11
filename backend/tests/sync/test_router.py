from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient

from app.auth.clerk import get_current_clerk_user_id
from app.main import app

_TEST_USER_ID = "user_sync_router_test"

_KDF_PARAMS = {
    "algorithm": "PBKDF2",
    "hash": "SHA-256",
    "iterations": 600_000,
    "iv": "aXY=",
}

_ACTIVATE_BODY = {
    "wrapped_master_key_passphrase": "wrapped-passphrase-v1",
    "kdf_salt_passphrase": "salt-passphrase",
    "kdf_params_passphrase": _KDF_PARAMS,
    "wrapped_master_key_recovery": "wrapped-recovery-v1",
    "kdf_salt_recovery": "salt-recovery",
    "kdf_params_recovery": _KDF_PARAMS,
}


@pytest.fixture
def client() -> Iterator[TestClient]:
    # Bypasses real Clerk JWT verification, same as tests/users/test_router.py
    # - that chain is already covered by tests/auth/test_clerk.py.
    app.dependency_overrides[get_current_clerk_user_id] = lambda: _TEST_USER_ID

    # Deliberately not used as a context manager: see
    # tests/users/test_router.py's identical fixture for why (the
    # session-scoped pool fixture in conftest.py already keeps it open).
    yield TestClient(app)

    app.dependency_overrides.clear()


def test_get_sync_credentials_is_inactive_before_activation(
    client: TestClient,
) -> None:
    response = client.get("/sync/credentials")

    assert response.status_code == 200
    assert response.json() == {"active": False}


def test_post_sync_activate_creates_keys_and_returns_them(
    client: TestClient,
) -> None:
    response = client.post("/sync/activate", json=_ACTIVATE_BODY)

    assert response.status_code == 201
    assert response.json() == {"active": True, **_ACTIVATE_BODY}


def test_post_sync_activate_twice_is_rejected_with_409(
    client: TestClient,
) -> None:
    client.post("/sync/activate", json=_ACTIVATE_BODY)
    second = client.post("/sync/activate", json=_ACTIVATE_BODY)

    assert second.status_code == 409
    assert second.json()["detail"]["code"] == "SYNC_ALREADY_ACTIVE"


def test_get_sync_credentials_is_active_after_activation(
    client: TestClient,
) -> None:
    client.post("/sync/activate", json=_ACTIVATE_BODY)

    response = client.get("/sync/credentials")

    assert response.status_code == 200
    assert response.json() == {"active": True, **_ACTIVATE_BODY}


def test_post_rotate_passphrase_updates_only_the_passphrase_half(
    client: TestClient,
) -> None:
    client.post("/sync/activate", json=_ACTIVATE_BODY)

    new_kdf_params = {**_KDF_PARAMS, "iterations": 700_000}
    response = client.post(
        "/sync/rotate-passphrase",
        json={
            "wrapped_master_key_passphrase": "wrapped-passphrase-v2",
            "kdf_salt_passphrase": "salt-passphrase-v2",
            "kdf_params_passphrase": new_kdf_params,
        },
    )

    assert response.status_code == 200
    body = response.json()
    assert body["wrapped_master_key_passphrase"] == "wrapped-passphrase-v2"
    assert body["kdf_salt_passphrase"] == "salt-passphrase-v2"
    assert body["kdf_params_passphrase"] == new_kdf_params
    assert body["wrapped_master_key_recovery"] == "wrapped-recovery-v1"
    assert body["kdf_salt_recovery"] == "salt-recovery"
    assert body["kdf_params_recovery"] == _KDF_PARAMS


def test_post_rotate_passphrase_without_activation_returns_404(
    client: TestClient,
) -> None:
    response = client.post(
        "/sync/rotate-passphrase",
        json={
            "wrapped_master_key_passphrase": "wrapped-passphrase-v2",
            "kdf_salt_passphrase": "salt-passphrase-v2",
            "kdf_params_passphrase": _KDF_PARAMS,
        },
    )

    assert response.status_code == 404
    assert response.json()["detail"]["code"] == "SYNC_NOT_ACTIVE"


def test_sync_endpoints_require_authentication() -> None:
    # No dependency override and, deliberately, no `client` fixture: the
    # 401 is raised by get_current_clerk_user_id before any DB access, so
    # this does not need (and must not trigger) the app's lifespan/pool -
    # see the `client` fixture's comment on why TestClient(app) is never
    # used as a context manager in this file.
    response = TestClient(app).get("/sync/credentials")

    assert response.status_code == 401
