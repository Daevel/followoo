import { describe, expect, it } from "vitest";
import { base64ToBytes, bytesToBase64 } from "./encoding";

describe("bytesToBase64 / base64ToBytes", () => {
  it("round-trips arbitrary bytes, including 0x00 and 0xff", () => {
    const original = new Uint8Array([0, 1, 2, 254, 255, 128, 64]);

    const roundTripped = base64ToBytes(bytesToBase64(original));

    expect(roundTripped).toEqual(original);
  });

  it("round-trips an empty byte array", () => {
    const original = new Uint8Array([]);

    expect(base64ToBytes(bytesToBase64(original))).toEqual(original);
  });
});
