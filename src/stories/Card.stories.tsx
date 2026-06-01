import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "../components/ui/Card";

const meta: Meta<typeof Card> = {
  title: "Components/UI/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Card title",
    },
    description: {
      control: "text",
      description: "Card description",
    },
    color: {
      control: { type: "select" },
      options: ["primary", "accent", "bg", "foreground"],
      description: "Card color variant",
    },
    iconName: {
      control: "text",
      description: "Icon name",
    },
    opacity: {
      control: "boolean",
      description: "Apply backdrop blur effect",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Primary: Story = {
  args: {
    title: "Crescita sicura",
    description: "Una card compatta con icona e testo.",
    color: "primary",
    iconName: "shield",
  },
};

export const Accent: Story = {
  args: {
    title: "Crescita sicura",
    description: "Una card compatta con icona e testo.",
    color: "accent",
    iconName: "shield",
  },
};

export const Bg: Story = {
  args: {
    title: "Crescita sicura",
    description: "Una card compatta con icona e testo.",
    color: "bg",
    iconName: "shield",
  },
};

export const Foreground: Story = {
  args: {
    title: "Crescita sicura",
    description: "Una card compatta con icona e testo.",
    color: "foreground",
    iconName: "shield",
  },
};
