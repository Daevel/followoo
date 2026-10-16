import { GCM_IV_LENGTH_BYTES } from "./constants";
import { base64ToBytes, bytesToBase64 } from "./encoding";

export type EncryptedPayload = {
  ciphertext: string;
  iv: string;
};

/**
 * Direct AES-GCM encryption/decryption of arbitrary data with an already
 * unlocked master key - distinct from wrapping.ts's wrapMasterKey/
 * unwrapMasterKey, which wrap the master key *itself* with a KDF-derived
 * key from a human secret (passphrase/recovery code). This pair is for
 * encrypting history snapshot payloads (v3.1.0 Task 2) once the master
 * key is already available in memory for the session.
 *
 * Unlike a wrong passphrase/recovery code, a decrypt failure here is not
 * expected validation - the master key is already known-correct for this
 * session, so a failure means something is actually wrong with the
 * stored data. Callers should report it as a real error.
 */

async function importMasterKeyForAesGcm(
  masterKey: Uint8Array<ArrayBuffer>
): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", masterKey, "AES-GCM", false, [
    "encrypt",
    "decrypt",
  ]);
}

export async function encryptWithMasterKey(
  masterKey: Uint8Array<ArrayBuffer>,
  plaintext: string
): Promise<EncryptedPayload> {
  const iv = crypto.getRandomValues(new Uint8Array(GCM_IV_LENGTH_BYTES));
  const key = await importMasterKeyForAesGcm(masterKey);

  const ciphertextBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(plaintext)
  );

  return {
    ciphertext: bytesToBase64(new Uint8Array(ciphertextBuffer)),
    iv: bytesToBase64(iv),
  };
}

export async function decryptWithMasterKey(
  masterKey: Uint8Array<ArrayBuffer>,
  payload: EncryptedPayload
): Promise<string> {
  const key = await importMasterKeyForAesGcm(masterKey);
  const iv = base64ToBytes(payload.iv);
  const ciphertext = base64ToBytes(payload.ciphertext);

  const plaintextBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  );

  return new TextDecoder().decode(plaintextBuffer);
}
