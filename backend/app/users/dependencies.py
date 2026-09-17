from collections.abc import Callable

from fastapi import Depends, HTTPException

from app.auth.clerk import get_current_clerk_user_id
from app.users.service import Entitlement, get_entitlement

_ENTITLEMENT_RANK: dict[Entitlement, int] = {"base": 0, "pro": 1}


def require_entitlement(min_level: Entitlement) -> Callable[..., str]:
    """Dependency factory: gate a route behind a minimum entitlement level.

    No route uses `min_level="pro"` yet - the first Pro-only feature ships
    in v3.1.0 - but the check itself needs to exist and be verified now so
    that feature can just add `Depends(require_entitlement("pro"))` without
    also having to design and test the gate at the same time.
    """

    def _dependency(user_id: str = Depends(get_current_clerk_user_id)) -> str:
        entitlement = get_entitlement(user_id)

        if _ENTITLEMENT_RANK[entitlement] < _ENTITLEMENT_RANK[min_level]:
            raise HTTPException(
                status_code=403,
                detail={
                    "code": "ENTITLEMENT_INSUFFICIENT",
                    "message": f"This action requires a {min_level} plan.",
                },
            )

        return user_id

    return _dependency
