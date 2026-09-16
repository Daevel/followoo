import time
from typing import Any

import jwt
import pytest
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives.asymmetric.rsa import RSAPrivateKey
from fastapi import HTTPException

from app.auth import clerk

_PERMITTED_ORIGIN = "http://localhost:5173"


def _detail_code(error: HTTPException) -> object:
    # HTTPException.detail is typed as `str | None` upstream even though
    # app.auth.clerk always passes a {"code", "message"} dict at runtime;
    # narrow it explicitly rather than fighting mypy with a cast.
    assert isinstance(error.detail, dict)
    return error.detail["code"]


class _StubSigningKey:
    def __init__(self, key: Any) -> None:
        self.key = key


class _StubJWKClient:
    """Stands in for PyJWKClient so tests never hit the network.

    Real Clerk verification matches a token's `kid` header against a JWKS
    document fetched over HTTP; that fetch/matching logic belongs to PyJWT
    itself, not to app.auth.clerk, so tests only need to stub what
    `get_current_clerk_user_id` actually calls: resolving a token to a
    signing key.
    """

    def __init__(self, key: Any) -> None:
        self._key = key

    def get_signing_key_from_jwt(self, token: str) -> _StubSigningKey:
        return _StubSigningKey(self._key)


def _make_token(
    private_key: RSAPrivateKey,
    *,
    sub: str = "user_123",
    expires_in: int = 3600,
    azp: str | None = _PERMITTED_ORIGIN,
) -> str:
    now = int(time.time())
    payload: dict[str, Any] = {"sub": sub, "iat": now, "exp": now + expires_in}

    if azp is not None:
        payload["azp"] = azp

    return jwt.encode(payload, private_key, algorithm="RS256")


@pytest.fixture(autouse=True)
def stub_clerk_settings(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(
        clerk,
        "get_clerk_settings",
        lambda: clerk.ClerkSettings(
            followoo_clerk_jwks_url="https://example.test/.well-known/jwks.json",
            followoo_cors_origins=_PERMITTED_ORIGIN,
        ),
    )


@pytest.fixture
def signing_key(monkeypatch: pytest.MonkeyPatch) -> RSAPrivateKey:
    private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    monkeypatch.setattr(
        clerk, "_get_jwk_client", lambda: _StubJWKClient(private_key.public_key())
    )
    return private_key


def test_valid_token_returns_user_id(signing_key: RSAPrivateKey) -> None:
    token = _make_token(signing_key, sub="user_abc")

    user_id = clerk.get_current_clerk_user_id(authorization=f"Bearer {token}")

    assert user_id == "user_abc"


def test_expired_token_returns_401(signing_key: RSAPrivateKey) -> None:
    token = _make_token(signing_key, expires_in=-60)

    with pytest.raises(HTTPException) as exc_info:
        clerk.get_current_clerk_user_id(authorization=f"Bearer {token}")

    assert exc_info.value.status_code == 401
    assert _detail_code(exc_info.value) == "AUTH_TOKEN_EXPIRED"


def test_invalid_signature_returns_401(signing_key: RSAPrivateKey) -> None:
    # Signed with a key the (stubbed) JWKS endpoint never advertised.
    wrong_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    token = _make_token(wrong_key)

    with pytest.raises(HTTPException) as exc_info:
        clerk.get_current_clerk_user_id(authorization=f"Bearer {token}")

    assert exc_info.value.status_code == 401
    assert _detail_code(exc_info.value) == "AUTH_TOKEN_INVALID"


def test_missing_authorization_header_returns_401() -> None:
    with pytest.raises(HTTPException) as exc_info:
        clerk.get_current_clerk_user_id(authorization=None)

    assert exc_info.value.status_code == 401
    assert _detail_code(exc_info.value) == "AUTH_TOKEN_MISSING"


def test_unpermitted_azp_returns_401(signing_key: RSAPrivateKey) -> None:
    token = _make_token(signing_key, azp="https://not-followoo.example")

    with pytest.raises(HTTPException) as exc_info:
        clerk.get_current_clerk_user_id(authorization=f"Bearer {token}")

    assert exc_info.value.status_code == 401
    assert _detail_code(exc_info.value) == "AUTH_TOKEN_INVALID"
