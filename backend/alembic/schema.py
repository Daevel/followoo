"""SQLAlchemy Core table definitions used only by Alembic.

This exists solely so `alembic revision --autogenerate` has something to
diff the live database against. It is deliberately Core (`sa.Table`), not
ORM: application code under `app/` never imports SQLAlchemy and keeps
reading/writing rows with `psycopg` directly (see
`app/updates/repository.py`). Nothing outside `alembic/` should import
this module.
"""

import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB, UUID

metadata = sa.MetaData()

updates = sa.Table(
    "updates",
    metadata,
    sa.Column(
        "id",
        UUID(as_uuid=True),
        primary_key=True,
        server_default=sa.text("gen_random_uuid()"),
    ),
    sa.Column("slug", sa.Text(), nullable=False, unique=True),
    sa.Column("product_name", sa.Text(), nullable=False),
    sa.Column("version", sa.Text(), nullable=False),
    sa.Column("release_date", sa.Date(), nullable=False),
    sa.Column("description", sa.Text(), nullable=False),
    sa.Column("badge_background_color", sa.Text(), nullable=True),
    sa.Column(
        "groups",
        JSONB(astext_type=sa.Text()),
        nullable=False,
        server_default=sa.text("'[]'::jsonb"),
    ),
    sa.Column(
        "is_published",
        sa.Boolean(),
        nullable=False,
        server_default=sa.text("false"),
    ),
    sa.Column("published_at", sa.DateTime(timezone=True), nullable=True),
    sa.Column(
        "created_at",
        sa.DateTime(timezone=True),
        nullable=False,
        server_default=sa.text("now()"),
    ),
    sa.Column(
        "updated_at",
        sa.DateTime(timezone=True),
        nullable=False,
        server_default=sa.text("now()"),
    ),
)
