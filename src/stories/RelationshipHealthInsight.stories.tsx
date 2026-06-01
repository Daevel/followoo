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

export const Average: Story = {
  args: {
    insight: {
      color: "foreground",
      level: "average",
      title: "Rete media",
      score: 45,
      description: "La tua rete potrebbe aver bisogno di attenzione.",
    },
  },
};

export const Critical: Story = {
  args: {
    insight: {
      color: "foreground",
      level: "critical",
      title: "Rete critica",
      score: 20,
      description: "La tua rete ha bisogno di revisione urgente.",
    },
  },
};
