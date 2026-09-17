from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient

from app.auth.clerk import get_current_clerk_claims, get_current_clerk_user_id
from app.db import get_connection
from app.main import app

_TEST_USER_ID = "user_router_test"


@pytest.fixture
def client() -> Iterator[TestClient]:
    # Bypasses real Clerk JWT verification - that chain is already covered
    # by tests/auth/test_clerk.py. These tests are only about what
    # app/users/router.py does once a caller is known to be verified.
    app.dependency_overrides[get_current_clerk_user_id] = lambda: _TEST_USER_ID
    app.dependency_overrides[get_current_clerk_claims] = lambda: {
        "sub": _TEST_USER_ID,
        "email": "router-test@example.com",
    }

    # Deliberately not used as a context manager: that would re-run
    # app/main.py's lifespan (open/close the pool) on every test, which
    # conflicts with tests/users/conftest.py's session-scoped pool - a
    # psycopg_pool.ConnectionPool can't be reopened once closed. The
    # conftest fixture already keeps the pool open for the whole session.
    yield TestClient(app)

    app.dependency_overrides.clear()


def test_get_users_me_creates_user_and_returns_base_plan(
    client: TestClient,
) -> None:
    response = client.get("/users/me")

    assert response.status_code == 200
    assert response.json() == {
        "user_id": _TEST_USER_ID,
        "email": "router-test@example.com",
        "plan": "base",
    }


def test_get_users_me_is_idempotent(client: TestClient) -> None:
    first = client.get("/users/me")
    second = client.get("/users/me")

    assert first.json() == second.json()

    with get_connection() as connection, connection.cursor() as cursor:
        cursor.execute(
            "SELECT count(*) AS n FROM users WHERE id = %s", (_TEST_USER_ID,)
        )
        row = cursor.fetchone()

    assert row is not None
    assert row["n"] == 1


def test_post_usage_events_logs_event(client: TestClient) -> None:
    response = client.post("/usage-events", json={"event_type": "analysis_run"})

    assert response.status_code == 204

    with get_connection() as connection, connection.cursor() as cursor:
        cursor.execute(
            "SELECT event_type FROM usage_events WHERE user_id = %s",
            (_TEST_USER_ID,),
        )
        row = cursor.fetchone()

    assert row is not None
    assert row["event_type"] == "analysis_run"


def test_post_usage_events_rejects_empty_event_type(client: TestClient) -> None:
    response = client.post("/usage-events", json={"event_type": ""})

    assert response.status_code == 422
