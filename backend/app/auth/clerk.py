from functools import lru_cache

import jwt
from fastapi import Header, HTTPException
from jwt import PyJWKClient
from pydantic_settings import BaseSettings, SettingsConfigDict

_ALGORITHMS = ["RS256"]


class ClerkSettings(BaseSettings):
    followoo_clerk_jwks_url: str
    # Reuses the exact same env var main.py already parses for CORS: the
    # frontend origin(s) allowed to call this API are, for Followoo's single
    # SPA + single backend setup, the same origin(s) Clerk mints session
    # tokens for. If that assumption ever breaks (e.g. a second consumer
    # with a different azp), split this into its own setting.
    followoo_cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


@lru_cache
def get_clerk_settings() -> ClerkSettings:
    return ClerkSettings()  # type: ignore[call-arg]


@lru_cache
def _get_jwk_client() -> PyJWKClient:
    # PyJWKClient fetches and caches the JWKS document (5 minute lifespan by
    # default) instead of calling out to Clerk on every request.
    return PyJWKClient(get_clerk_settings().followoo_clerk_jwks_url)


def _permitted_origins() -> list[str]:
    return [
        origin.strip()
        for origin in get_clerk_settings().followoo_cors_origins.split(",")
        if origin.strip()
    ]


def _unauthorized(code: str, message: str) -> HTTPException:
    # No dedicated AppError/ERROR_CODES class exists in the Python backend
    # (unlike src/errors/ on the frontend) - this mirrors that pattern's
    # intent with a stable, machine-readable `code` in a structured detail
    # body, on top of the plain HTTPException convention already used
    # throughout app/updates/router.py.
    return HTTPException(
        status_code=401, detail={"code": code, "message": message}
    )


def get_current_clerk_user_id(
    authorization: str | None = Header(default=None),
) -> str:
    """FastAPI dependency: verify a Clerk session JWT and return its user id.

    Verification is local/stateless against Clerk's public JWKS - no call to
    Clerk's API happens per request (see `_get_jwk_client`), and no Clerk
    Secret Key is needed: JWKS signature verification only needs public
    keys.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise _unauthorized("AUTH_TOKEN_MISSING", "Missing bearer token.")

    token = authorization.removeprefix("Bearer ").strip()

    if not token:
        raise _unauthorized("AUTH_TOKEN_MISSING", "Missing bearer token.")

    try:
        signing_key = _get_jwk_client().get_signing_key_from_jwt(token)
        payload = jwt.decode(token, signing_key.key, algorithms=_ALGORITHMS)
    except jwt.ExpiredSignatureError as error:
        raise _unauthorized("AUTH_TOKEN_EXPIRED", "Token has expired.") from error
    except jwt.InvalidTokenError as error:
        raise _unauthorized(
            "AUTH_TOKEN_INVALID", "Token signature or claims are invalid."
        ) from error

    # azp identifies which origin the token was minted for; Clerk omits it
    # for tokens where the concept doesn't apply, so only enforce it when
    # present (matches Clerk's own guidance on validating this claim).
    azp = payload.get("azp")
    if azp is not None and azp not in _permitted_origins():
        raise _unauthorized(
            "AUTH_TOKEN_INVALID", "Token was not issued for a known origin."
        )

    user_id = payload.get("sub")

    if not isinstance(user_id, str) or not user_id:
        raise _unauthorized(
            "AUTH_TOKEN_INVALID", "Token is missing a subject claim."
        )

    return user_id
