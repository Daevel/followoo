import os
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.core.limiter import limiter
from app.core.sentry import init_sentry
from app.db import get_pool
from app.updates.router import router as updates_router
from app.users.router import router as users_router

load_dotenv()
init_sentry()


def _handle_rate_limit_exceeded(request: Request, exc: Exception) -> Response:
    # slowapi's own handler is typed for RateLimitExceeded specifically,
    # narrower than the Exception Starlette's add_exception_handler expects;
    # it is only ever invoked for RateLimitExceeded since that is the
    # exception class it is registered against below.
    assert isinstance(exc, RateLimitExceeded)
    return _rate_limit_exceeded_handler(request, exc)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    get_pool().open()
    try:
        yield
    finally:
        get_pool().close()


app = FastAPI(title="Followoo API", lifespan=lifespan)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _handle_rate_limit_exceeded)
app.add_middleware(SlowAPIMiddleware)

cors_origins = [
    origin.strip()
    for origin in os.getenv(
        "FOLLOWOO_CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check() -> dict[str, str]:
    # Intentionally not rate limited (see python-backend skill): must stay
    # cheap and available for uptime/health checks.
    return {"status": "ok"}


app.include_router(updates_router)
app.include_router(users_router)
