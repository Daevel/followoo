import {
  RELATIONSHIP_GROUPS,
  type RelationshipGroupCounts,
  type RelationshipGroupKey,
} from "@/features/relationship/constants/relationshipGroups";

// Geometry of the loading network, in SVG units (viewBox -150 -120 300 240).
// The dots stand for shares of the network, never for actual people.

export type NetworkPoint = { x: number; y: number };

export type NetworkDot = NetworkPoint & { radius: number };

export const NETWORK_VIEWBOX = "-150 -120 300 240";

/** Orbit radius per group, innermost first, in RELATIONSHIP_GROUPS order. */
export const ORBIT_RADII: Record<RelationshipGroupKey, number> = {
  mutual: 46,
  unfollowers: 76,
  followersOnly: 104,
};

export const ORBIT_SCALE = { x: 1.25, y: 0.95 } as const;

const CONSTELLATION = { minRadius: 52, spread: 56, scaleX: 1.2, scaleY: 0.92 };

// Small deterministic generator, so the constellation looks the same on
// every run instead of jumping around between analyses.
function createRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}

/** Starting positions: dots spread on a loose double spiral around the center. */
export function buildConstellation(count: number): NetworkDot[] {
  const random = createRandom(7);

  return Array.from({ length: count }, (_, index) => {
    const angle = (index / count) * Math.PI * 4 + random() * 0.35;
    const radius = CONSTELLATION.minRadius + random() * CONSTELLATION.spread;

    return {
      x: Math.cos(angle) * radius * CONSTELLATION.scaleX,
      y: Math.sin(angle) * radius * CONSTELLATION.scaleY,
      radius: 3.4,
    };
  });
}

/**
 * How many dots each group gets, in proportion to the real counts (largest
 * remainder). Uses at most `maxDots`, and no more dots than people; a group
 * with at least one person keeps at least one dot when there is room.
 */
export function allocateDots(
  counts: RelationshipGroupCounts,
  maxDots: number
): RelationshipGroupCounts {
  const keys = RELATIONSHIP_GROUPS.map((group) => group.key);
  const total = keys.reduce((sum, key) => sum + counts[key], 0);
  const empty: RelationshipGroupCounts = {
    mutual: 0,
    followersOnly: 0,
    unfollowers: 0,
  };

  if (total === 0 || maxDots <= 0) return empty;

  const dots = Math.min(maxDots, total);
  const exact = keys.map((key) => (counts[key] / total) * dots);
  const result = { ...empty };

  keys.forEach((key, index) => {
    result[key] = Math.floor(exact[index]);
  });

  let left = dots - keys.reduce((sum, key) => sum + result[key], 0);
  const byRemainder = keys
    .map((key, index) => ({ key, rest: exact[index] - result[key] }))
    .sort((a, b) => b.rest - a.rest);

  for (const { key } of byRemainder) {
    if (left === 0) break;
    result[key] += 1;
    left -= 1;
  }

  // A non-empty group never disappears: take a dot from the largest group.
  for (const key of keys) {
    if (counts[key] > 0 && result[key] === 0) {
      const largest = keys.reduce((a, b) => (result[a] >= result[b] ? a : b));
      if (result[largest] > 1) {
        result[largest] -= 1;
        result[key] = 1;
      }
    }
  }

  return result;
}

export type DotAssignment = {
  /** Index into the dot list, or the dot fades out when it has no group. */
  index: number;
  group: RelationshipGroupKey | null;
  target: NetworkPoint;
};

/**
 * Sends every dot to an orbit: the dots closest to the center go to the
 * inner orbit (mutual), the farthest to the outer one, and each orbit keeps
 * the dots' angular order so they glide instead of crossing over.
 */
export function assignDotsToOrbits(
  positions: NetworkPoint[],
  allocation: RelationshipGroupCounts
): DotAssignment[] {
  const byDistance = positions
    .map((point, index) => ({ index, point, d: Math.hypot(point.x, point.y) }))
    .sort((a, b) => a.d - b.d);

  const assignments: DotAssignment[] = [];
  let cursor = 0;

  RELATIONSHIP_GROUPS.forEach((group) => {
    const members = byDistance
      .slice(cursor, cursor + allocation[group.key])
      .sort(
        (a, b) =>
          Math.atan2(a.point.y, a.point.x) - Math.atan2(b.point.y, b.point.x)
      );
    cursor += allocation[group.key];

    const radius = ORBIT_RADII[group.key];
    const start =
      members.length > 0
        ? Math.atan2(members[0].point.y, members[0].point.x)
        : 0;

    members.forEach((member, i) => {
      const angle = start + (i / members.length) * Math.PI * 2;
      assignments.push({
        index: member.index,
        group: group.key,
        target: {
          x: Math.cos(angle) * radius * ORBIT_SCALE.x,
          y: Math.sin(angle) * radius * ORBIT_SCALE.y,
        },
      });
    });
  });

  for (const rest of byDistance.slice(cursor)) {
    assignments.push({ index: rest.index, group: null, target: rest.point });
  }

  return assignments;
}

/** "Each dot is about N people", or null when the dots are too few to say. */
export function peoplePerDot(total: number, dots: number) {
  if (dots === 0 || total < dots * 2) return null;
  const exact = total / dots;
  return exact < 20 ? Math.round(exact) : Math.round(exact / 5) * 5;
}
