import type { Meta, StoryObj } from "@storybook/react-vite";
import { SnapshotComparisonView } from "@/features/history/components/SnapshotComparisonView";
import type { AnalysisComparison } from "@/features/relationship/services/analysisComparisonService";
import type { InstagramUser } from "@/types/instagram.types";

const at = (username: string, isoDate: string): InstagramUser => ({
  username,
  timestamp: Date.parse(isoDate) / 1000,
});

const diff = (users: InstagramUser[], count = users.length) => ({
  count,
  users,
});

// Consistent sample: 342 -> 354 followers (+15 new, -3 lost), 209 -> 212
// following (+5, -2), mutuals 128 -> 136.
const comparison: AnalysisComparison = {
  older: {
    createdAt: "2026-10-17T09:15:00Z",
    dataUntil: Date.parse("2026-10-16T00:00:00Z") / 1000,
    followersCount: 342,
    followingCount: 209,
    mutualsCount: 128,
    notFollowingBackCount: 81,
    followBackRate: 61,
  },
  newer: {
    createdAt: "2026-11-24T18:42:00Z",
    dataUntil: Date.parse("2026-11-23T00:00:00Z") / 1000,
    followersCount: 354,
    followingCount: 212,
    mutualsCount: 136,
    notFollowingBackCount: 76,
    followBackRate: 64,
  },
  newFollowers: diff(
    [
      at("giulia.marino", "2026-11-20T00:00:00Z"),
      at("tommaso.r", "2026-11-09T00:00:00Z"),
      at("noemi.visual", "2026-10-30T00:00:00Z"),
    ],
    3
  ),
  lostFollowers: diff([
    at("marta.bianchi", "2024-05-12T00:00:00Z"),
    at("andrea.backend", "2025-01-03T00:00:00Z"),
    at("serena.creative", "2025-08-19T00:00:00Z"),
  ]),
  newMutuals: diff([at("giulia.marino", "2026-11-20T00:00:00Z")]),
  lostMutuals: diff([]),
  newFollowing: diff([at("sofia_fer", "2026-11-02T00:00:00Z")]),
  lostFollowing: diff([at("old.brand", "2023-02-11T00:00:00Z")]),
  renamedFollowers: [],
  renamedFollowing: [],
  dataOrderMismatch: false,
};

const meta: Meta<typeof SnapshotComparisonView> = {
  title: "Features/History/SnapshotComparisonView",
  component: SnapshotComparisonView,
  tags: ["autodocs"],
  args: { comparison, onBack: () => {} },
};

export default meta;
type Story = StoryObj<typeof SnapshotComparisonView>;

export const Default: Story = {};

/** Nobody left: the lists say so instead of staying blank. */
export const NobodyUnfollowed: Story = {
  args: {
    comparison: { ...comparison, lostFollowers: diff([]) },
  },
};

/** The export saved second holds older data than the first one. */
export const DataOrderMismatch: Story = {
  args: {
    comparison: { ...comparison, dataOrderMismatch: true },
  },
};
