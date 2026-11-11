import pytest
from fastapi import HTTPException

from app.users import dependencies


def test_require_entitlement_returns_user_id_when_sufficient(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setattr(dependencies, "get_entitlement", lambda user_id: "pro")

    check = dependencies.require_entitlement("base")

    assert check(user_id="user_pro") == "user_pro"


def test_require_entitlement_allows_exact_match() -> None:
    check = dependencies.require_entitlement("base")

    # No monkeypatch needed: with no subscriptions table rows for this
    # user, get_entitlement legitimately resolves to "base" already.
    assert check(user_id="user_base") == "user_base"


def test_require_entitlement_raises_403_when_insufficient(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setattr(dependencies, "get_entitlement", lambda user_id: "base")

    check = dependencies.require_entitlement("pro")

    with pytest.raises(HTTPException) as exc_info:
        check(user_id="user_base")

    assert exc_info.value.status_code == 403
    assert isinstance(exc_info.value.detail, dict)
    assert exc_info.value.detail["code"] == "ENTITLEMENT_INSUFFICIENT"
