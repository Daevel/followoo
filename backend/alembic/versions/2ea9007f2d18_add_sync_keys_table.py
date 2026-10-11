"""add sync_keys table

Revision ID: 2ea9007f2d18
Revises: 16b756ec1007
Create Date: 2026-10-11 13:15:33.678248

v3.1.0 Task 1: zero-knowledge key storage for the opt-in encrypted
history/sync feature. One row per user, holding only the client-generated
master key wrapped (AES-GCM) twice - once with a key derived (PBKDF2)
from the user's passphrase, once with a key derived from a recovery
code - plus the salts/params needed to re-derive those wrapping keys.
The backend never sees the passphrase, recovery code, or master key in
plaintext. See backend/app/sync/.

"""

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

# revision identifiers, used by Alembic.
revision: str = '2ea9007f2d18'
down_revision: str | None = '16b756ec1007'
branch_labels: str | tuple[str, ...] | None = None
depends_on: str | tuple[str, ...] | None = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "sync_keys",
        sa.Column(
            "id",
            sa.UUID(),
            server_default=sa.text("gen_random_uuid()"),
            nullable=False,
        ),
        sa.Column("user_id", sa.Text(), nullable=False),
        sa.Column("wrapped_master_key_passphrase", sa.Text(), nullable=False),
        sa.Column("kdf_salt_passphrase", sa.Text(), nullable=False),
        sa.Column(
            "kdf_params_passphrase",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=False,
        ),
        sa.Column("wrapped_master_key_recovery", sa.Text(), nullable=False),
        sa.Column("kdf_salt_recovery", sa.Text(), nullable=False),
        sa.Column(
            "kdf_params_recovery",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=False,
        ),
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
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id"),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table("sync_keys")
