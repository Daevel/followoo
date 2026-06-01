import type { Meta, StoryObj } from "@storybook/react-vite";
import { PersonaBadge } from "../components/ui/PersonaBadge";

const meta: Meta<typeof PersonaBadge> = {
  title: "Components/UI/PersonaBadge",
  component: PersonaBadge,
  tags: ["autodocs"],
  argTypes: {
    persona: {
      control: { type: "select" },
      options: ["SUPER_FAN", "ENGAGED", "FICKLE", "LURKER", "DORMANT"],
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

export const Fickle: Story = {
  args: {
    persona: "FICKLE",
    size: "md",
  },
};

export const Lurker: Story = {
  args: {
    persona: "LURKER",
    size: "md",
  },
};

export const Dormant: Story = {
  args: {
    persona: "DORMANT",
    size: "md",
  },
};

export const SmallSize: Story = {
  args: {
    persona: "SUPER_FAN",
    size: "sm",
  },
};
