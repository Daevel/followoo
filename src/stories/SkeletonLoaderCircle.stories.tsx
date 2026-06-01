import type { Meta, StoryObj } from "@storybook/react-vite";
import { SkeletonLoaderCircle } from "../components/ui/SkeletonLoaderCircle";

const meta: Meta<typeof SkeletonLoaderCircle> = {
  title: "Components/UI/SkeletonLoaderCircle",
  component: SkeletonLoaderCircle,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
      description: "Skeleton size",
    },
    color: {
      control: { type: "select" },
      options: ["primary", "accent", "foreground", "white"],
      description: "Skeleton color",
    },
    label: {
      control: "text",
      description: "Aria label",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SkeletonLoaderCircle>;

export const Small: Story = {
  args: {
    size: "sm",
    color: "primary",
  },
};

export const Medium: Story = {
  args: {
    size: "md",
    color: "primary",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    color: "primary",
  },
};
