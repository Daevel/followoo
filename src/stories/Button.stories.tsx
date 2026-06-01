import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../components/ui/Button";

const meta: Meta<typeof Button> = {
  title: "Components/UI/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    onClick: () => {},
  },
  argTypes: {
    children: {
      control: "text",
      description: "Button label",
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
      description: "Disable the button",
    },
    icon: {
      control: "text",
      description: "Optional icon name",
    },
    iconPosition: {
      control: { type: "select" },
      options: ["left", "right"],
      description: "Icon position",
    },
    type: {
      control: { type: "select" },
      options: ["button", "submit", "reset"],
      description: "Button type",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    background: "primary",
    foreground: "foreground",
    children: "Primary",
  },
};

export const Accent: Story = {
  args: {
    background: "accent",
    foreground: "foreground",
    children: "Accent",
  },
};

export const Bg: Story = {
  args: {
    background: "bg",
    foreground: "foreground",
    children: "Bg",
  },
};

export const Disabled: Story = {
  args: {
    background: "primary",
    foreground: "foreground",
    disabled: true,
    children: "Disabled",
  },
};

export const WithIcon: Story = {
  args: {
    background: "primary",
    foreground: "foreground",
    icon: "check",
    children: "Con icona",
  },
};
