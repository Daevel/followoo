import type { Meta, StoryObj } from "@storybook/react-vite";
import { EngagementPatternChart } from "../components/ui/charts/EngagementPatternChart";

const meta: Meta<typeof EngagementPatternChart> = {
  title: "Components/UI/Charts/EngagementPatternChart",
  component: EngagementPatternChart,
  tags: ["autodocs"],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof EngagementPatternChart>;

const sampleRecentUnfollowers = [
  { username: "alice", timestamp: 1680005000 },
  { username: "marco", timestamp: 1680006000 },
  { username: "sara", timestamp: 1680007000 },
];

export const EngagementPatternChart_: Story = {
  args: {
    recentUnfollowers: sampleRecentUnfollowers,
  },
};
