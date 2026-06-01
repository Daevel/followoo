import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { PersonaFilter } from "../components/ui/PersonaFilter";

const meta: Meta<typeof PersonaFilter> = {
  title: "Components/UI/PersonaFilter",
  component: PersonaFilter,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PersonaFilter>;

const personaCounts = {
  SUPER_FAN: 45,
  ENGAGED: 120,
  OCCASIONAL: 234,
  GHOST: 89,
};

export const Default: Story = {
  render: () => {
    const [selectedPersona, setSelectedPersona] = useState<
      keyof typeof personaCounts | null
    >(null);
    return (
      <PersonaFilter
        personaCounts={personaCounts}
        selectedPersona={selectedPersona}
        onPersonaChange={setSelectedPersona}
      />
    );
  },
};
