import { describe, expect, it } from "vitest";
import { generateRecoveryCode } from "./recoveryCode";

describe("generateRecoveryCode", () => {
  it("matches the 4x4 group shape with the restricted alphabet", () => {
    const code = generateRecoveryCode();

    expect(code).toMatch(
      /^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{4}(-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{4}){3}$/
    );
  });

  it("never contains visually ambiguous characters", () => {
    const code = generateRecoveryCode();

    expect(code).not.toMatch(/[0O1IL]/);
  });

  it("never returns the same code twice", () => {
    const first = generateRecoveryCode();
    const second = generateRecoveryCode();

    expect(first).not.toBe(second);
  });
});
