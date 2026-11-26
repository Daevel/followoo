import { describe, expect, it } from "vitest";
import { formatSnapshotDate, formatSnapshotDay } from "./formatSnapshotDate";

describe("formatSnapshotDate", () => {
  it("is always in English, whatever the browser language", () => {
    expect(formatSnapshotDay("2026-11-24T12:00:00Z")).toBe("Nov 24, 2026");
    expect(formatSnapshotDate("2026-11-24T12:00:00Z")).toMatch(
      /^Nov 24, 2026, \d{1,2}:\d{2}\s?[AP]M$/
    );
  });
});
