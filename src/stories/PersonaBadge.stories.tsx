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
      description: "Tipo di persona utente",
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md"],
      description: "Grandezza badge",
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

export const AllVariants: Story = {
  name: "Tutte le varianti",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <PersonaBadge persona="SUPER_FAN" size="md" />
        <PersonaBadge persona="ENGAGED" size="md" />
        <PersonaBadge persona="FICKLE" size="md" />
        <PersonaBadge persona="LURKER" size="md" />
        <PersonaBadge persona="DORMANT" size="md" />
      </div>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <PersonaBadge persona="SUPER_FAN" size="sm" />
        <PersonaBadge persona="ENGAGED" size="sm" />
        <PersonaBadge persona="FICKLE" size="sm" />
      </div>
    </div>
  ),
};

export const SmallSize: Story = {
  args: {
    persona: "SUPER_FAN",
    size: "sm",
  },
};
