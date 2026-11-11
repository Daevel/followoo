// PBKDF2-SHA256 iteration count per OWASP's Password Storage Cheat Sheet
// guidance for this algorithm/hash pair. Bump this (and only this) if that
// guidance changes - existing wrapped keys keep working regardless, since
// the iteration count they were wrapped with travels alongside them in
// `kdfParams.iterations` and is what unwrapping actually uses.
export const KDF_ITERATIONS = 600_000;
export const KDF_HASH = "SHA-256";
export const KDF_ALGORITHM = "PBKDF2";

export const MASTER_KEY_LENGTH_BYTES = 32; // 256-bit master key
export const SALT_LENGTH_BYTES = 16;
export const GCM_IV_LENGTH_BYTES = 12; // WebCrypto's recommended AES-GCM IV length

// Excludes visually ambiguous characters (0/O, 1/I/L) since this code is
// meant to be hand-copied and retyped by a person. Its length (32) is a
// power of two - see recoveryCode.ts for why that matters.
export const RECOVERY_CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export const RECOVERY_CODE_GROUP_LENGTH = 4;
export const RECOVERY_CODE_GROUP_COUNT = 4;
