import type { Meta, StoryObj } from "@storybook/react-vite";
import { FabIcon } from "../components/ui/FabIcon";

const meta: Meta<typeof FabIcon> = {
  title: "Components/UI/FabIcon",
  component: FabIcon,
  tags: ["autodocs"],
  argTypes: {
    icon: {
      control: "text",
      description: "Icon name",
    },
    background: {
      control: { type: "select" },
      options: ["primary", "accent", "bg"],
      description: "Background color",
    },
    foreground: {
      control: { type: "select" },
      options: ["primary", "accent", "bg", "foreground"],
      description: "Text color",
    },
    disabled: {
      control: "boolean",
      description: "Disable the fab icon",
    },
    type: {
      control: { type: "select" },
      options: ["button", "submit", "reset"],
      description: "Button type",
    },
  },
};

export default meta;
type Story = StoryObj<typeof FabIcon>;

export const Primary: Story = {
  args: {
    icon: "upload",
    background: "primary",
    foreground: "foreground",
    disabled: false,
  },
};

export const Accent: Story = {
  args: {
    icon: "download",
    background: "accent",
    foreground: "foreground",
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    icon: "upload",
    background: "primary",
    foreground: "foreground",
    disabled: true,
  },
};
