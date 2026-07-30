import type { Meta, StoryObj } from "@storybook/react-vite";
import { ResultsPieChart } from "../components/ui/charts/ResultPieChart";

const meta: Meta<typeof ResultsPieChart> = {
  title: "Components/UI/Charts/ResultsPieChart",
  component: ResultsPieChart,
  tags: ["autodocs"],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof ResultsPieChart>;

const sampleData = [
  { name: "Mutual", value: 42 },
  { name: "Followers", value: 18 },
  { name: "Following", value: 7 },
  { name: "Blocked", value: 2 },
];

export const ResultPieChart_: Story = {
  args: {
    data: sampleData,
    title: "Panoramica",
  },
};
