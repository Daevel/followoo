import type { Meta, StoryObj } from "@storybook/react-vite";
import { RelationshipHealthInsight } from "../components/ui/RelationshipHealthInsight";

const meta: Meta<typeof RelationshipHealthInsight> = {
  title: "Components/UI/RelationshipHealthInsight",
  component: RelationshipHealthInsight,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RelationshipHealthInsight>;

export const HealthyNetwork: Story = {
  args: {
    insight: {
      color: "foreground",
      level: "healthy",
      title: "Salute della rete",
      score: 81,
      description: "La tua rete Instagram sembra forte e impegnata.",
    },
  },
};

export const AtRisk: Story = {
  args: {
    insight: {
      color: "foreground",
      level: "at_risk",
      title: "Rete a rischio",
      score: 45,
      description: "La tua rete potrebbe aver bisogno di attenzione.",
    },
  },
};

export const UnhealthyNetwork: Story = {
  args: {
    insight: {
      color: "foreground",
      level: "unhealthy",
      title: "Rete non salutare",
      score: 20,
      description: "La tua rete ha bisogno di revisione.",
    },
  },
};
