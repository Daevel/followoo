import type { Meta, StoryObj } from "@storybook/react-vite";
import { PersonaBadge } from "../components/ui/PersonaBadge";

const meta: Meta<typeof PersonaBadge> = {
  title: "Components/UI/PersonaBadge",
  component: PersonaBadge,
  tags: ["autodocs"],
  argTypes: {
    persona: {
      control: { type: "select" },
      options: ["SUPER_FAN", "ENGAGED", "OCCASIONAL", "GHOST"],
      description: "Persona type",
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md"],
      description: "Badge size",
    },
  },
};

export default meta;
type Story = StoryObj<typeof PersonaBadge>;

export const SuperFan: Story = {
  args: {
    persona: "SUPER_FAN",
    size: "md",
  },
};

export const Engaged: Story = {
  args: {
    persona: "ENGAGED",
    size: "md",
  },
};

export const Occasional: Story = {
  args: {
    persona: "OCCASIONAL",
    size: "md",
  },
};

export const Ghost: Story = {
  args: {
    persona: "GHOST",
    size: "md",
  },
};

export const SmallSize: Story = {
  args: {
    persona: "SUPER_FAN",
    size: "sm",
  },
};
