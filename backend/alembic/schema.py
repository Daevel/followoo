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

# id = the Clerk JWT "sub" claim directly (see app/auth/clerk.py) - no
# separate internal id, so a user row can always be looked up/created by
# the value already verified out of the token, no extra round trip.
users = sa.Table(
    "users",
    metadata,
    sa.Column("id", sa.Text(), primary_key=True),
    sa.Column("email", sa.Text(), nullable=True),
    sa.Column(
        "created_at",
        sa.DateTime(timezone=True),
        nullable=False,
        server_default=sa.text("now()"),
    ),
)

# status is intentionally unconstrained TEXT, not an enum/CHECK: Stripe's
# own subscription statuses (Task 3) include more values than the
# active/trialing/past_due/canceled set relevant to entitlement today
# (e.g. incomplete, incomplete_expired, unpaid, paused), and this table
# should not need a migration just to accept a status Stripe already sends.
subscriptions = sa.Table(
    "subscriptions",
    metadata,
    sa.Column(
        "id",
        UUID(as_uuid=True),
        primary_key=True,
        server_default=sa.text("gen_random_uuid()"),
    ),
    sa.Column(
        "user_id", sa.Text(), sa.ForeignKey("users.id"), nullable=False, index=True
    ),
    sa.Column("stripe_subscription_id", sa.Text(), nullable=True, unique=True),
    sa.Column("status", sa.Text(), nullable=True),
    sa.Column("current_period_end", sa.DateTime(timezone=True), nullable=True),
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

usage_events = sa.Table(
    "usage_events",
    metadata,
    sa.Column(
        "id",
        UUID(as_uuid=True),
        primary_key=True,
        server_default=sa.text("gen_random_uuid()"),
    ),
    sa.Column(
        "user_id", sa.Text(), sa.ForeignKey("users.id"), nullable=False, index=True
    ),
    sa.Column("event_type", sa.Text(), nullable=False),
    sa.Column(
        "created_at",
        sa.DateTime(timezone=True),
        nullable=False,
        server_default=sa.text("now()"),
    ),
    sa.Column("metadata", JSONB(astext_type=sa.Text()), nullable=True),
)
