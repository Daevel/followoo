import type { Meta, StoryObj } from "@storybook/react-vite";
import { BadgeVersion } from "../components/ui/BadgeVersion";

const meta: Meta<typeof BadgeVersion> = {
  title: "Components/UI/BadgeVersion",
  component: BadgeVersion,
  tags: ["autodocs"],
  argTypes: {
    version: {
      control: "text",
      description: "Version string",
    },
    backgroundColor: {
      control: { type: "select" },
      options: ["primary", "accent", "bg"],
      description: "Background color",
    },
  },
};

export default meta;
type Story = StoryObj<typeof BadgeVersion>;

export const BadgeVersion_: Story = {
  args: {
    version: "1.0.0",
    backgroundColor: "primary",
  },
};
