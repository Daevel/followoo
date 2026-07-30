import type { Meta, StoryObj } from "@storybook/react-vite";
import { RecentUnfollowActivityChart } from "../components/ui/charts/RecentUnfollowActivityChart";

const meta: Meta<typeof RecentUnfollowActivityChart> = {
  title: "Components/UI/Charts/RecentUnfollowActivityChart",
  component: RecentUnfollowActivityChart,
  tags: ["autodocs"],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof RecentUnfollowActivityChart>;

const sampleRecentUnfollowers = [
  { username: "alice", timestamp: 1680005000 },
  { username: "marco", timestamp: 1680006000 },
  { username: "sara", timestamp: 1680007000 },
];

export const RecentUnfollowActivityChart_: Story = {
  args: {
    recentUnfollowers: sampleRecentUnfollowers,
  },
};
