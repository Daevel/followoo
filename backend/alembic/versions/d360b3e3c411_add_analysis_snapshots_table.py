"""add analysis_snapshots table

Revision ID: d360b3e3c411
Revises: 2ea9007f2d18
Create Date: 2026-10-16 00:00:00.000000

v3.1.0 Task 2: zero-knowledge storage for a user's history of past
Instagram export analyses. Only `created_at` is stored in plaintext (used
to order/list entries); the analysis itself lives in `encrypted_blob`,
AES-GCM-encrypted client-side with the already-unlocked master key from
v3.1.0 Task 1 (see src/features/sync/crypto/), with `iv` stored alongside
it in plaintext (the nonce is not a secret, just decryption metadata).
`schema_version` lets the client-side encrypted JSON shape evolve later
without needing a migration here. See backend/app/snapshots/.

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd360b3e3c411'
down_revision: str | None = '2ea9007f2d18'
branch_labels: str | tuple[str, ...] | None = None
depends_on: str | tuple[str, ...] | None = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "analysis_snapshots",
        sa.Column(
            "id",
            sa.UUID(),
            server_default=sa.text("gen_random_uuid()"),
            nullable=False,
        ),
        sa.Column("user_id", sa.Text(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("encrypted_blob", sa.Text(), nullable=False),
        sa.Column("iv", sa.Text(), nullable=False),
        sa.Column(
            "schema_version", sa.Integer(), server_default=sa.text("1"), nullable=False
        ),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_analysis_snapshots_user_id"),
        "analysis_snapshots",
        ["user_id"],
        unique=False,
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(
        op.f("ix_analysis_snapshots_user_id"), table_name="analysis_snapshots"
    )
    op.drop_table("analysis_snapshots")
