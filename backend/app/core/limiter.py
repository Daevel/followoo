from slowapi import Limiter
from slowapi.util import get_remote_address

# Shared across routers so every public endpoint is rate limited from the
# same client-IP key function and registered on the same limiter instance
# main.py attaches to app.state.
limiter = Limiter(key_func=get_remote_address)

# Applied to public read endpoints such as /updates. Not meant for /health,
# which the python-backend skill requires to stay cheap and unrestricted.
PUBLIC_RATE_LIMIT = "30/minute"
