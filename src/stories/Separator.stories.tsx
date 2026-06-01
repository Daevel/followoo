import type { Meta, StoryObj } from "@storybook/react-vite";
import { Separator } from "../components/ui/Separator";

const meta: Meta<typeof Separator> = {
  title: "Components/UI/Separator",
  component: Separator,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "accent", "foreground"],
      description: "Separator variant",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Primary: Story = {
  args: {
    variant: "primary",
  },
};

export const Accent: Story = {
  args: {
    variant: "accent",
  },
};

export const Foreground: Story = {
  args: {
    variant: "foreground",
  },
};
