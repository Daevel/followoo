from pydantic import BaseModel, Field


class KdfParams(BaseModel):
    # Free-form beyond "has an algorithm/hash/iterations" - this travels
    # back to the client verbatim and is never interpreted server-side, so
    # tightening it here would just be a migration-adjacent change the
    # client-side KDF never actually needs backend validation for.
    algorithm: str
    hash: str
    iterations: int
    iv: str


class ActivateSyncRequest(BaseModel):
    # Every field here is already client-side ciphertext/KDF metadata -
    # never the passphrase, recovery code, or master key in plaintext. See
    # backend/app/sync/router.py and src/features/sync/crypto/.
    wrapped_master_key_passphrase: str = Field(min_length=1)
    kdf_salt_passphrase: str = Field(min_length=1)
    kdf_params_passphrase: KdfParams
    wrapped_master_key_recovery: str = Field(min_length=1)
    kdf_salt_recovery: str = Field(min_length=1)
    kdf_params_recovery: KdfParams


class RotatePassphraseRequest(BaseModel):
    wrapped_master_key_passphrase: str = Field(min_length=1)
    kdf_salt_passphrase: str = Field(min_length=1)
    kdf_params_passphrase: KdfParams
