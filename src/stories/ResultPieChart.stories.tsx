import type { Meta, StoryObj } from "@storybook/react-vite";
import { ResultsPieChart } from "../components/ui/charts/ResultPieChart";

const meta: Meta<typeof ResultsPieChart> = {
  title: "Components/UI/Charts/ResultsPieChart",
  component: ResultsPieChart,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ResultsPieChart>;

const sampleData = [
  { name: "Mutual", value: 42 },
  { name: "Followers", value: 18 },
  { name: "Unfollowers", value: 7 },
  { name: "Blocked", value: 2 },
];

export const Default: Story = {
  args: {
    data: sampleData,
    title: "Panoramica",
  },
};
