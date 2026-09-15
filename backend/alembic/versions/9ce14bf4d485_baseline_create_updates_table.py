"""baseline: create updates table

Revision ID: 9ce14bf4d485
Revises:
Create Date: 2026-09-15 10:18:52.676732

This baseline was never diffed against the live Neon database directly
(no credentials for it were available when this migration was written).
It was reconstructed from how `app/updates/repository.py` and the
pre-Python TypeScript repository it replaced read the `updates` table,
which only proves the 12 columns below exist with roughly these types -
not the exact nullability/defaults/constraints in production. Before
running `alembic stamp` against the real database (see backend/README.md),
diff this against the actual `updates` table (e.g. `\\d+ updates` in
psql) and adjust if it disagrees.

"""

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "9ce14bf4d485"
down_revision: str | None = None
branch_labels: str | tuple[str, ...] | None = None
depends_on: str | tuple[str, ...] | None = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "updates",
        sa.Column(
            "id",
            sa.UUID(),
            server_default=sa.text("gen_random_uuid()"),
            nullable=False,
        ),
        sa.Column("slug", sa.Text(), nullable=False),
        sa.Column("product_name", sa.Text(), nullable=False),
        sa.Column("version", sa.Text(), nullable=False),
        sa.Column("release_date", sa.Date(), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("badge_background_color", sa.Text(), nullable=True),
        sa.Column(
            "groups",
            postgresql.JSONB(astext_type=sa.Text()),
            server_default=sa.text("'[]'::jsonb"),
            nullable=False,
        ),
        sa.Column(
            "is_published",
            sa.Boolean(),
            server_default=sa.text("false"),
            nullable=False,
        ),
        sa.Column("published_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("slug"),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table("updates")
