import re
from functools import lru_cache
from typing import Any

import sentry_sdk
from pydantic_settings import BaseSettings, SettingsConfigDict
from sentry_sdk.types import Event, Hint

# Keys that must never leave this process, even redacted-in-place inside a
# nested dict. Mirrors the same non-negotiable list documented in
# .opencode/skills/project-context/SKILL.md and enforced client-side in
# src/errors/sentryInit.ts: Instagram export content, usernames, follower/
# following lists, and relationship analysis results.
_SENSITIVE_KEY_RE = re.compile(
    r"instagram|follower|following|username|relationship|export|zip"
    r"|blocked|restricted|closefriend|unfollow|persona",
    re.IGNORECASE,
)

_REDACTED = "[redacted]"


class SentrySettings(BaseSettings):
    followoo_sentry_dsn: str | None = None
    followoo_environment: str = "development"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


@lru_cache
def get_sentry_settings() -> SentrySettings:
    return SentrySettings()  # type: ignore[call-arg]


def _redact_value(value: Any) -> Any:
    if isinstance(value, list | tuple | set):
        return f"[redacted {type(value).__name__}({len(value)})]"

    if isinstance(value, dict):
        return _redact_mapping(value)

    return value


def _redact_mapping(mapping: dict[str, Any]) -> dict[str, Any]:
    return {
        key: _REDACTED if _SENSITIVE_KEY_RE.search(key) else _redact_value(value)
        for key, value in mapping.items()
    }


def scrub_event(event: Event, _hint: Hint) -> Event | None:
    """Defensive scrubbing for what we can reach structurally.

    This can only redact structured fields (extra/contexts/request), not
    free-text exception messages a future bug might accidentally embed
    private data into - the real guardrail for that remains the existing
    discipline of only raising AppError-style errors with static, developer
    authored messages (see backend/app/updates/repository.py and the
    project-context skill).
    """
    request = event.get("request")
    if isinstance(request, dict):
        request.pop("headers", None)
        request.pop("cookies", None)
        request.pop("query_string", None)

        url = request.get("url")
        if isinstance(url, str):
            request["url"] = url.split("?", 1)[0].split("#", 1)[0]

    extra = event.get("extra")
    if isinstance(extra, dict):
        event["extra"] = _redact_mapping(extra)

    contexts = event.get("contexts")
    if isinstance(contexts, dict):
        event["contexts"] = {
            key: _redact_mapping(value) if isinstance(value, dict) else value
            for key, value in contexts.items()
        }

    return event


def init_sentry() -> None:
    settings = get_sentry_settings()

    if not settings.followoo_sentry_dsn:
        return

    sentry_sdk.init(
        dsn=settings.followoo_sentry_dsn,
        environment=settings.followoo_environment,
        send_default_pii=False,
        # No performance tracing/profiling: not needed for a small public
        # API and it is one less surface that could end up recording
        # request bodies.
        traces_sample_rate=0.0,
        before_send=scrub_event,
    )
