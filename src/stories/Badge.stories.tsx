import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../components/ui/Badge";

const meta: Meta<typeof Badge> = {
  title: "Components/UI/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      description: "Testo del badge",
    },
    tone: {
      control: { type: "select" },
      options: ["neutral", "brand", "success", "warning", "danger"],
      description: "Tono (colora il testo; brand anche bordo e fondo)",
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md"],
      description: "Altezza: 20 o 24px",
    },
    dotClass: {
      control: "text",
      description: "Classe del punto colorato, es. bg-data-3",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Neutral: Story = {
  args: { tone: "neutral", children: "v3.0.0" },
};

export const Brand: Story = {
  args: { tone: "brand", children: "v3.1.0" },
};

export const Success: Story = {
  args: { tone: "success", children: "Sana" },
};

export const Warning: Story = {
  args: { tone: "warning", children: "Intermedia" },
};

export const Danger: Story = {
  args: { tone: "danger", children: "Critica" },
};

export const AllVariants: Story = {
  name: "Tutte le varianti",
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
      <Badge tone="neutral">v3.0.0</Badge>
      <Badge tone="brand">v3.1.0</Badge>
      <Badge tone="success">Sana</Badge>
      <Badge tone="warning">Intermedia</Badge>
      <Badge tone="danger">Critica</Badge>
      <Badge dotClass="bg-data-3">Super Fan</Badge>
      <Badge dotClass="bg-data-4" size="sm">
        Lurker
      </Badge>
    </div>
  ),
};
