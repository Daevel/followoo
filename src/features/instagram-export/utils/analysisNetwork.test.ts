import { describe, expect, it } from "vitest";
import {
  allocateDots,
  assignDotsToOrbits,
  buildConstellation,
  ORBIT_RADII,
  ORBIT_SCALE,
  peoplePerDot,
} from "./analysisNetwork";

const sum = (counts: Record<string, number>) =>
  Object.values(counts).reduce((a, b) => a + b, 0);

describe("allocateDots", () => {
  it("splits the dots in the real proportions", () => {
    const allocation = allocateDots(
      { mutual: 801, followersOnly: 447, unfollowers: 179 },
      36
    );

    expect(sum(allocation)).toBe(36);
    expect(allocation).toEqual({
      mutual: 20,
      followersOnly: 11,
      unfollowers: 5,
    });
  });

  it("never uses more dots than people", () => {
    const allocation = allocateDots(
      { mutual: 3, followersOnly: 1, unfollowers: 0 },
      24
    );

    expect(allocation).toEqual({
      mutual: 3,
      followersOnly: 1,
      unfollowers: 0,
    });
  });

  it("keeps at least one dot for a small non-empty group", () => {
    const allocation = allocateDots(
      { mutual: 2000, followersOnly: 1, unfollowers: 0 },
      24
    );

    expect(allocation.followersOnly).toBe(1);
    expect(allocation.unfollowers).toBe(0);
    expect(sum(allocation)).toBe(24);
  });

  it("gives no dots to an empty network", () => {
    expect(
      allocateDots({ mutual: 0, followersOnly: 0, unfollowers: 0 }, 36)
    ).toEqual({ mutual: 0, followersOnly: 0, unfollowers: 0 });
  });
});

describe("assignDotsToOrbits", () => {
  it("sends every allocated dot to its orbit and the rest nowhere", () => {
    const dots = buildConstellation(24);
    const allocation = { mutual: 3, followersOnly: 1, unfollowers: 0 };
    const assignments = assignDotsToOrbits(dots, allocation);

    expect(assignments).toHaveLength(24);
    expect(new Set(assignments.map((a) => a.index)).size).toBe(24);
    expect(assignments.filter((a) => a.group === "mutual")).toHaveLength(3);
    expect(assignments.filter((a) => a.group === null)).toHaveLength(20);

    for (const assignment of assignments) {
      if (!assignment.group) continue;
      const radius = ORBIT_RADII[assignment.group];
      const onEllipse =
        (assignment.target.x / (radius * ORBIT_SCALE.x)) ** 2 +
        (assignment.target.y / (radius * ORBIT_SCALE.y)) ** 2;
      expect(onEllipse).toBeCloseTo(1);
    }
  });

  it("gives the inner orbit to the dots closest to the center", () => {
    const dots = buildConstellation(36);
    const assignments = assignDotsToOrbits(dots, {
      mutual: 20,
      followersOnly: 11,
      unfollowers: 5,
    });
    const distance = (index: number) =>
      Math.hypot(dots[index].x, dots[index].y);
    const farthestMutual = Math.max(
      ...assignments
        .filter((a) => a.group === "mutual")
        .map((a) => distance(a.index))
    );
    const closestOuter = Math.min(
      ...assignments
        .filter((a) => a.group === "unfollowers")
        .map((a) => distance(a.index))
    );

    expect(farthestMutual).toBeLessThanOrEqual(closestOuter);
  });
});

describe("peoplePerDot", () => {
  it("rounds large shares to the nearest five", () => {
    expect(peoplePerDot(1427, 36)).toBe(40);
  });

  it("is hidden when there are barely more people than dots", () => {
    expect(peoplePerDot(30, 24)).toBeNull();
    expect(peoplePerDot(0, 24)).toBeNull();
  });
});
