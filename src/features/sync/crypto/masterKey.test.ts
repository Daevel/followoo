import { describe, expect, it } from "vitest";
import { generateMasterKey } from "./masterKey";

describe("generateMasterKey", () => {
  it("returns 32 bytes (256 bits)", () => {
    expect(generateMasterKey()).toHaveLength(32);
  });

  it("never returns the same key twice", () => {
    const first = generateMasterKey();
    const second = generateMasterKey();

    expect(first).not.toEqual(second);
  });
});
