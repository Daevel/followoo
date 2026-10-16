from pydantic import BaseModel, Field


class CreateSnapshotRequest(BaseModel):
    # Already client-encrypted (AES-GCM) with the unlocked master key - see
    # src/features/sync/crypto/. Never a plaintext InstagramAnalysisResult.
    encrypted_blob: str = Field(min_length=1)
    iv: str = Field(min_length=1)
