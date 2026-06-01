import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "../components/ui/Skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "Components/UI/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
      description: "Skeleton size",
    },
    shape: {
      control: { type: "select" },
      options: ["circle", "rectangle"],
      description: "Skeleton shape",
    },
    animation: {
      control: { type: "select" },
      options: ["pulse", "wave"],
      description: "Animation type",
    },
    ariaLabel: {
      control: "text",
      description: "Aria label",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const RectangleSmall: Story = {
  args: {
    size: "sm",
    shape: "rectangle",
    animation: "wave",
    ariaLabel: "Loading content",
  },
};

export const RectangleMedium: Story = {
  args: {
    size: "md",
    shape: "rectangle",
    animation: "wave",
    ariaLabel: "Loading content",
  },
};

export const RectangleLarge: Story = {
  args: {
    size: "lg",
    shape: "rectangle",
    animation: "wave",
    ariaLabel: "Loading content",
  },
};

export const CircleSmall: Story = {
  args: {
    size: "sm",
    shape: "circle",
    animation: "wave",
    ariaLabel: "Loading content",
  },
};

export const CircleMedium: Story = {
  args: {
    size: "md",
    shape: "circle",
    animation: "wave",
    ariaLabel: "Loading content",
  },
};

export const CircleLarge: Story = {
  args: {
    size: "lg",
    shape: "circle",
    animation: "wave",
    ariaLabel: "Loading content",
  },
};

export const WithPulseAnimation: Story = {
  args: {
    size: "md",
    shape: "rectangle",
    animation: "pulse",
    ariaLabel: "Loading content",
  },
};
