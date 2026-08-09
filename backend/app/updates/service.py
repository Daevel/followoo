from app.updates.repository import get_published_updates


def retrieve_published_updates() -> list[dict[str, object]]:
    return get_published_updates()
