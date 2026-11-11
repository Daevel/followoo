import { describe, expect, it } from "vitest";
import { generateMasterKey } from "./masterKey";
import { generateRecoveryCode } from "./recoveryCode";
import {
  MasterKeyUnwrapError,
  unwrapMasterKey,
  wrapMasterKey,
} from "./wrapping";

describe("wrapMasterKey / unwrapMasterKey", () => {
  it("round-trips the master key with a passphrase", async () => {
    const masterKey = generateMasterKey();
    const wrapped = await wrapMasterKey(
      masterKey,
      "correct horse battery staple"
    );

    const unwrapped = await unwrapMasterKey(
      wrapped,
      "correct horse battery staple"
    );

    expect(unwrapped).toEqual(masterKey);
  });

  it("round-trips the master key with a recovery code", async () => {
    const masterKey = generateMasterKey();
    const recoveryCode = generateRecoveryCode();
    const wrapped = await wrapMasterKey(masterKey, recoveryCode);

    const unwrapped = await unwrapMasterKey(wrapped, recoveryCode);

    expect(unwrapped).toEqual(masterKey);
  });

  it("throws MasterKeyUnwrapError (never a generic Error) for the wrong passphrase", async () => {
    const masterKey = generateMasterKey();
    const wrapped = await wrapMasterKey(masterKey, "the right passphrase");

    await expect(
      unwrapMasterKey(wrapped, "the wrong passphrase")
    ).rejects.toBeInstanceOf(MasterKeyUnwrapError);
  });

  it("throws MasterKeyUnwrapError for a wrong recovery code", async () => {
    const masterKey = generateMasterKey();
    const wrapped = await wrapMasterKey(masterKey, generateRecoveryCode());

    await expect(
      unwrapMasterKey(wrapped, generateRecoveryCode())
    ).rejects.toBeInstanceOf(MasterKeyUnwrapError);
  });

  it("never reuses the salt or IV across two wraps of the same secret", async () => {
    const masterKey = generateMasterKey();

    const first = await wrapMasterKey(masterKey, "same passphrase");
    const second = await wrapMasterKey(masterKey, "same passphrase");

    expect(first.kdfSalt).not.toBe(second.kdfSalt);
    expect(first.kdfParams.iv).not.toBe(second.kdfParams.iv);
    expect(first.wrappedMasterKey).not.toBe(second.wrappedMasterKey);
  });

  it("produces independently wrapped copies for the passphrase and recovery secrets", async () => {
    const masterKey = generateMasterKey();
    const passphrase = "a dedicated passphrase";
    const recoveryCode = generateRecoveryCode();

    const passphraseWrap = await wrapMasterKey(masterKey, passphrase);
    const recoveryWrap = await wrapMasterKey(masterKey, recoveryCode);

    // Unwrapping with the other secret's wrap must fail - these are two
    // independent envelopes around the same key, not interchangeable.
    await expect(
      unwrapMasterKey(passphraseWrap, recoveryCode)
    ).rejects.toBeInstanceOf(MasterKeyUnwrapError);
    await expect(
      unwrapMasterKey(recoveryWrap, passphrase)
    ).rejects.toBeInstanceOf(MasterKeyUnwrapError);

    expect(await unwrapMasterKey(passphraseWrap, passphrase)).toEqual(
      masterKey
    );
    expect(await unwrapMasterKey(recoveryWrap, recoveryCode)).toEqual(
      masterKey
    );
  });
});
