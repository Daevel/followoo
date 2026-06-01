import type { Meta, StoryObj } from "@storybook/react-vite";
import { Loading } from "../components/ui/Loading";

const meta: Meta<typeof Loading> = {
  title: "Components/UI/Loading",
  component: Loading,
  tags: ["autodocs"],
  argTypes: {
    loading: {
      control: "boolean",
      description: "Show loading state",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Loading>;

export const Active: Story = {
  args: {
    loading: true,
  },
};

export const Inactive: Story = {
  args: {
    loading: false,
  },
};
