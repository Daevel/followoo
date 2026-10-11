import {
  RECOVERY_CODE_ALPHABET,
  RECOVERY_CODE_GROUP_COUNT,
  RECOVERY_CODE_GROUP_LENGTH,
} from "./constants";

/**
 * A high-entropy, human-copyable secret (e.g. "XK4M-9PQR-7TZC-2WFH"),
 * generated with `crypto.getRandomValues` - never `Math.random` - the same
 * way the master key is. The alphabet's length (32) is a power of two, so
 * reading one byte (0-255) per character via `% 32` is unbiased: 256 is
 * exactly divisible by 32, no value is ever favored over another.
 */
export function generateRecoveryCode(): string {
  const totalChars = RECOVERY_CODE_GROUP_COUNT * RECOVERY_CODE_GROUP_LENGTH;
  const randomBytes = crypto.getRandomValues(new Uint8Array(totalChars));

  const chars = Array.from(
    randomBytes,
    (byte) => RECOVERY_CODE_ALPHABET[byte % RECOVERY_CODE_ALPHABET.length]
  );

  const groups: string[] = [];

  for (let i = 0; i < chars.length; i += RECOVERY_CODE_GROUP_LENGTH) {
    groups.push(chars.slice(i, i + RECOVERY_CODE_GROUP_LENGTH).join(""));
  }

  return groups.join("-");
}
