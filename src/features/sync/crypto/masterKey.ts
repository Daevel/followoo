import { MASTER_KEY_LENGTH_BYTES } from "./constants";

/**
 * The key that actually encrypts history snapshots (Task 2, not built
 * yet). Generated once at activation and never changes afterwards - only
 * how it is wrapped (passphrase vs recovery code) can change. Always
 * `crypto.getRandomValues`, never `Math.random`.
 */
export function generateMasterKey(): Uint8Array<ArrayBuffer> {
  return crypto.getRandomValues(new Uint8Array(MASTER_KEY_LENGTH_BYTES));
}
