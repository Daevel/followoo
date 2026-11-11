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
      description: "Etichetta pulsante",
    },
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "ghost", "danger"],
      description: "Ruolo del pulsante",
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
      description: "Altezza: 32, 40 o 48px",
    },
    loading: {
      control: "boolean",
      description: "Mostra lo spinner e disabilita il pulsante",
    },
    disabled: {
      control: "boolean",
      description: "Disabilitare il pulsante",
    },
    icon: {
      control: "text",
      description: "Nome icona opzionale",
    },
    iconPosition: {
      control: { type: "select" },
      options: ["left", "right"],
      description: "Posizione icona",
    },
    type: {
      control: { type: "select" },
      options: ["button", "submit", "reset"],
      description: "Tipo pulsante",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Analizza il tuo export",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Prova la demo",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Scopri di più",
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
    icon: "trash",
    children: "Elimina",
  },
};

export const AllVariants: Story = {
  name: "Tutte le varianti",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
        <Button variant="primary">Analizza il tuo export</Button>
        <Button variant="secondary">Prova la demo</Button>
        <Button variant="ghost">Scopri di più</Button>
        <Button variant="danger" icon="trash">
          Elimina
        </Button>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg" icon="upload">
          Large
        </Button>
        <Button loading>Analisi in corso...</Button>
        <Button disabled>Disabilitato</Button>
      </div>
    </div>
  ),
};
