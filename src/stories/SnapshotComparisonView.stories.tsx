import type { Meta, StoryObj } from "@storybook/react-vite";
import { SnapshotComparisonView } from "@/features/history/components/SnapshotComparisonView";
import type { AnalysisComparison } from "@/features/relationship/services/analysisComparisonService";
import type { InstagramUser } from "@/types/instagram.types";

const at = (username: string, isoDate: string): InstagramUser => ({
  username,
  timestamp: Date.parse(isoDate) / 1000,
});

const diff = (users: InstagramUser[]) => ({ count: users.length, users });

const comparison: AnalysisComparison = {
  older: {
    createdAt: "2026-10-18T10:00:00Z",
    dataUntil: Date.parse("2026-08-31T00:00:00Z") / 1000,
    followersCount: 342,
    followingCount: 209,
    mutualsCount: 128,
  },
  newer: {
    createdAt: "2026-10-18T09:00:00Z",
    dataUntil: Date.parse("2026-10-17T00:00:00Z") / 1000,
    followersCount: 354,
    followingCount: 212,
    mutualsCount: 131,
  },
  newFollowers: diff([
    at("giulia.marino", "2026-10-02T00:00:00Z"),
    at("tommaso.r", "2026-09-21T00:00:00Z"),
  ]),
  lostFollowers: diff([at("marta.bianchi", "2024-05-12T00:00:00Z")]),
  newMutuals: diff([at("giulia.marino", "2026-10-02T00:00:00Z")]),
  lostMutuals: diff([]),
  newFollowing: diff([at("sofia_fer", "2026-09-09T00:00:00Z")]),
  lostFollowing: diff([]),
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

export const DataDates: Story = {};

/** Old snapshots saved before exports carried timestamps fall back to the save date. */
export const WithoutTimestamps: Story = {
  args: {
    comparison: {
      ...comparison,
      older: { ...comparison.older, dataUntil: null },
      newer: { ...comparison.newer, dataUntil: null },
    },
  },
};

/** A single anomalous timestamp makes the data dates disagree with save order - flagged, never trusted to reorder anything. */
export const DataOrderMismatch: Story = {
  args: {
    comparison: { ...comparison, dataOrderMismatch: true },
  },
};
