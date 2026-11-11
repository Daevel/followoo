import { describe, expect, it } from "vitest";
import { generateMasterKey } from "./masterKey";
import { decryptWithMasterKey, encryptWithMasterKey } from "./masterKeyCipher";

describe("encryptWithMasterKey / decryptWithMasterKey", () => {
  it("round-trips a JSON payload", async () => {
    const masterKey = generateMasterKey();
    const plaintext = JSON.stringify({ mutual: ["a", "b"], unfollowers: [] });

    const encrypted = await encryptWithMasterKey(masterKey, plaintext);
    const decrypted = await decryptWithMasterKey(masterKey, encrypted);

    expect(decrypted).toBe(plaintext);
  });

  it("round-trips an empty string", async () => {
    const masterKey = generateMasterKey();

    const encrypted = await encryptWithMasterKey(masterKey, "");
    const decrypted = await decryptWithMasterKey(masterKey, encrypted);

    expect(decrypted).toBe("");
  });

  it("never reuses the IV across two encryptions of the same plaintext", async () => {
    const masterKey = generateMasterKey();

    const first = await encryptWithMasterKey(masterKey, "same text");
    const second = await encryptWithMasterKey(masterKey, "same text");

    expect(first.iv).not.toBe(second.iv);
    expect(first.ciphertext).not.toBe(second.ciphertext);
  });

  it("fails to decrypt with the wrong master key", async () => {
    const masterKey = generateMasterKey();
    const wrongKey = generateMasterKey();
    const encrypted = await encryptWithMasterKey(masterKey, "secret data");

    await expect(decryptWithMasterKey(wrongKey, encrypted)).rejects.toThrow();
  });
});
