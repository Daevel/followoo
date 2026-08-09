from datetime import date, datetime
from typing import Any, cast

from app.db import get_connection


def _serialize_value(value: Any) -> Any:
    if isinstance(value, date | datetime):
        return value.isoformat()

    return value


def get_published_updates() -> list[dict[str, object]]:
    query = """
        SELECT
          id,
          slug,
          product_name,
          version,
          release_date,
          description,
          badge_background_color,
          groups,
          is_published,
          published_at,
          created_at,
          updated_at
        FROM updates
        WHERE is_published = true
        ORDER BY published_at DESC NULLS LAST
    """

    with get_connection() as connection, connection.cursor() as cursor:
        cursor.execute(query)
        rows = cast(list[dict[str, Any]], cursor.fetchall())

    return [
        {
            "id": row["id"],
            "productName": row["product_name"],
            "version": row["version"],
            "releaseDate": _serialize_value(row["release_date"]),
            "description": row["description"],
            "badgeBackgroundColor": row["badge_background_color"] or "accent",
            "groups": row["groups"] or [],
            "slug": row["slug"],
            "publishedAt": _serialize_value(row["published_at"]),
        }
        for row in rows
    ]
