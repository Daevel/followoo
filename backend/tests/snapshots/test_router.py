from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient

from app.auth.clerk import get_current_clerk_user_id
from app.main import app

_TEST_USER_ID = "user_snapshots_router_test"
_OTHER_USER_ID = "user_snapshots_router_other"


@pytest.fixture
def client() -> Iterator[TestClient]:
    app.dependency_overrides[get_current_clerk_user_id] = lambda: _TEST_USER_ID

    # Deliberately not used as a context manager - see
    # tests/users/test_router.py's identical fixture for why.
    yield TestClient(app)

    app.dependency_overrides.clear()


def _switch_to_other_user() -> None:
    # `app.dependency_overrides` lives on the shared `app` object, not on
    # any one TestClient - a second "other_client" fixture active at the
    # same time as `client` would just overwrite the same dict key before
    # the test body runs. Flipping it mid-test on the same client is the
    # only way to actually get two different identities in one test.
    app.dependency_overrides[get_current_clerk_user_id] = lambda: _OTHER_USER_ID


def test_post_snapshots_creates_a_row(client: TestClient) -> None:
    response = client.post(
        "/snapshots", json={"encrypted_blob": "ciphertext-1", "iv": "iv-1"}
    )

    assert response.status_code == 201
    body = response.json()
    assert "id" in body
    assert "created_at" in body
    # Only ciphertext/iv/id/timestamp ever appear - never the plaintext
    # analysis or any follower/unfollower data.
    assert set(body.keys()) == {"id", "created_at"}


def test_get_snapshots_lists_newest_first(client: TestClient) -> None:
    client.post("/snapshots", json={"encrypted_blob": "c1", "iv": "iv1"})
    client.post("/snapshots", json={"encrypted_blob": "c2", "iv": "iv2"})

    response = client.get("/snapshots")

    assert response.status_code == 200
    body = response.json()
    assert len(body) == 2
    assert body[0]["created_at"] >= body[1]["created_at"]


def test_get_snapshots_respects_limit(client: TestClient) -> None:
    for i in range(3):
        client.post("/snapshots", json={"encrypted_blob": f"c{i}", "iv": f"iv{i}"})

    response = client.get("/snapshots?limit=2")

    assert response.status_code == 200
    assert len(response.json()) == 2


def test_get_snapshots_is_scoped_to_the_caller(client: TestClient) -> None:
    client.post("/snapshots", json={"encrypted_blob": "mine", "iv": "iv"})

    _switch_to_other_user()
    response = client.get("/snapshots")

    assert response.status_code == 200
    assert response.json() == []


def test_get_snapshot_by_id_returns_the_full_row(client: TestClient) -> None:
    created = client.post(
        "/snapshots", json={"encrypted_blob": "ciphertext-full", "iv": "iv-full"}
    ).json()

    response = client.get(f"/snapshots/{created['id']}")

    assert response.status_code == 200
    body = response.json()
    assert body["encrypted_blob"] == "ciphertext-full"
    assert body["iv"] == "iv-full"


def test_get_snapshot_by_id_404s_for_another_user(client: TestClient) -> None:
    created = client.post(
        "/snapshots", json={"encrypted_blob": "mine", "iv": "iv"}
    ).json()

    _switch_to_other_user()
    response = client.get(f"/snapshots/{created['id']}")

    assert response.status_code == 404
    assert response.json()["detail"]["code"] == "SNAPSHOT_NOT_FOUND"


def test_get_snapshot_by_id_404s_for_a_malformed_id(client: TestClient) -> None:
    response = client.get("/snapshots/not-a-uuid")

    assert response.status_code == 404
    assert response.json()["detail"]["code"] == "SNAPSHOT_NOT_FOUND"


def test_get_snapshot_by_id_404s_for_an_unknown_id(client: TestClient) -> None:
    response = client.get("/snapshots/00000000-0000-0000-0000-000000000000")

    assert response.status_code == 404


def test_delete_snapshot_removes_it(client: TestClient) -> None:
    created = client.post(
        "/snapshots", json={"encrypted_blob": "to-delete", "iv": "iv"}
    ).json()

    delete_response = client.delete(f"/snapshots/{created['id']}")
    assert delete_response.status_code == 204

    get_response = client.get(f"/snapshots/{created['id']}")
    assert get_response.status_code == 404


def test_delete_snapshot_404s_for_another_user(client: TestClient) -> None:
    created = client.post(
        "/snapshots", json={"encrypted_blob": "mine", "iv": "iv"}
    ).json()

    _switch_to_other_user()
    response = client.delete(f"/snapshots/{created['id']}")

    assert response.status_code == 404

    # Still there - the other user's delete attempt must not have worked.
    # Switch back to the owner to verify.
    app.dependency_overrides[get_current_clerk_user_id] = lambda: _TEST_USER_ID
    assert client.get(f"/snapshots/{created['id']}").status_code == 200


def test_snapshots_endpoints_require_authentication() -> None:
    # No dependency override and, deliberately, no `client` fixture - see
    # tests/sync/test_router.py's identical test for why TestClient(app) is
    # never used as a context manager here.
    response = TestClient(app).get("/snapshots")

    assert response.status_code == 401
