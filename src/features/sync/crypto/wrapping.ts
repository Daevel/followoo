import {
  GCM_IV_LENGTH_BYTES,
  KDF_ALGORITHM,
  KDF_HASH,
  KDF_ITERATIONS,
  SALT_LENGTH_BYTES,
} from "./constants";
import { base64ToBytes, bytesToBase64 } from "./encoding";

export type KdfParams = {
  // Plain `string` (not `typeof KDF_ALGORITHM`/`typeof KDF_HASH` literals):
  // this same shape travels through JSON over the wire and back
  // (src/features/sync/services/syncService.ts, the backend's jsonb
  // column), so it must structurally match that looser round-tripped
  // type, not just what this module itself produces.
  algorithm: string;
  hash: string;
  iterations: number;
  // base64 AES-GCM IV used for this particular wrap. Lives in kdfParams
  // rather than its own field: it is derivation/decryption metadata, not
  // a secret, and keeps the wire shape to exactly what the backend schema
  // documents (wrappedMasterKey/kdfSalt/kdfParams per secret).
  iv: string;
};

export type WrappedMasterKey = {
  wrappedMasterKey: string;
  kdfSalt: string;
  kdfParams: KdfParams;
};

/**
 * Thrown when unwrapping fails. Always treat this as "the passphrase or
 * recovery code the user typed is incorrect" - a normal, expected UI
 * validation outcome (like an invalid form field), never an
 * AppError/Sentry report. See this feature's activation hook and
 * project-context's privacy rules.
 *
 * AES-GCM's built-in authentication tag is what makes this detectable: a
 * wrong key decrypts to garbage that fails the integrity check, instead of
 * silently returning wrong bytes.
 */
export class MasterKeyUnwrapError extends Error {
  constructor() {
    super(
      "Failed to unwrap the master key - the secret is incorrect or the wrapped data is corrupted."
    );
    this.name = "MasterKeyUnwrapError";
  }
}

async function deriveWrappingKey(
  secret: string,
  salt: Uint8Array<ArrayBuffer>,
  iterations: number
): Promise<CryptoKey> {
  const secretKeyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    KDF_ALGORITHM,
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    { name: KDF_ALGORITHM, salt, iterations, hash: KDF_HASH },
    secretKeyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypts (wraps) `masterKey` with a key derived from `secret` (a
 * passphrase or a recovery code - this function does not care which).
 * Generates a fresh salt and IV every call, so wrapping the same master
 * key twice never produces the same ciphertext or reuses parameters.
 */
export async function wrapMasterKey(
  masterKey: Uint8Array<ArrayBuffer>,
  secret: string
): Promise<WrappedMasterKey> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH_BYTES));
  const iv = crypto.getRandomValues(new Uint8Array(GCM_IV_LENGTH_BYTES));
  const wrappingKey = await deriveWrappingKey(secret, salt, KDF_ITERATIONS);

  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    wrappingKey,
    masterKey
  );

  return {
    wrappedMasterKey: bytesToBase64(new Uint8Array(ciphertext)),
    kdfSalt: bytesToBase64(salt),
    kdfParams: {
      algorithm: KDF_ALGORITHM,
      hash: KDF_HASH,
      iterations: KDF_ITERATIONS,
      iv: bytesToBase64(iv),
    },
  };
}

/**
 * Decrypts (unwraps) a `WrappedMasterKey` with a key derived from
 * `secret`. Throws `MasterKeyUnwrapError` - and only that error - when the
 * secret is wrong or the data is corrupted; see that class for why this
 * must never be treated as an application error.
 */
export async function unwrapMasterKey(
  wrapped: WrappedMasterKey,
  secret: string
): Promise<Uint8Array<ArrayBuffer>> {
  const salt = base64ToBytes(wrapped.kdfSalt);
  const iv = base64ToBytes(wrapped.kdfParams.iv);
  const ciphertext = base64ToBytes(wrapped.wrappedMasterKey);

  const wrappingKey = await deriveWrappingKey(
    secret,
    salt,
    wrapped.kdfParams.iterations
  );

  try {
    const plaintext = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      wrappingKey,
      ciphertext
    );

    return new Uint8Array(plaintext);
  } catch {
    throw new MasterKeyUnwrapError();
  }
}
