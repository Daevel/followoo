import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { PersonaFilter } from "../components/ui/PersonaFilter";
import type { UserPersona } from "../types/instagram.types";

const meta: Meta<typeof PersonaFilter> = {
  title: "Components/UI/PersonaFilter",
  component: PersonaFilter,
  tags: ["autodocs"],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof PersonaFilter>;

const personaCounts: Record<UserPersona, number> = {
  SUPER_FAN: 45,
  ENGAGED: 120,
  FICKLE: 234,
  LURKER: 89,
  DORMANT: 56,
};

export const PersonaFilter_: Story = {
  render: () => {
    const [selectedPersona, setSelectedPersona] = useState<UserPersona | null>(
      null
    );
    return (
      <PersonaFilter
        personaCounts={personaCounts}
        selectedPersona={selectedPersona}
        onPersonaChange={(persona) => setSelectedPersona(persona)}
      />
    );
  },
};
