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
    background: {
      control: { type: "select" },
      options: ["primary", "accent", "bg"],
      description: "Colore di sfondo",
    },
    foreground: {
      control: { type: "select" },
      options: ["primary", "accent", "bg", "foreground"],
      description: "Colore del testo",
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
    background: "primary",
    foreground: "foreground",
    children: "Primary",
  },
};

export const Accent: Story = {
  args: {
    background: "accent",
    foreground: "foreground",
    children: "Accent",
  },
};

export const Bg: Story = {
  args: {
    background: "bg",
    foreground: "foreground",
    children: "Bg",
  },
};

export const Deactivated: Story = {
  args: {
    background: "primary",
    foreground: "foreground",
    disabled: true,
    children: "Disabilitato",
  },
};

export const IconVariant: Story = {
  args: {
    background: "primary",
    foreground: "foreground",
    icon: "check",
    children: "Con icona",
  },
};

export const AllVariants: Story = {
  name: "Tutte le varianti",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Button background="primary" foreground="foreground">
        Primary
      </Button>
      <Button background="accent" foreground="foreground">
        Accent
      </Button>
      <Button background="bg" foreground="foreground">
        Bg
      </Button>
      <Button background="primary" foreground="foreground" disabled>
        Disabilitato
      </Button>
      <Button background="primary" foreground="foreground" icon="check">
        Con icona
      </Button>
    </div>
  ),
};
