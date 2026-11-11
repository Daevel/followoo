import type { Meta, StoryObj } from "@storybook/react-vite";
import { FabIcon } from "../components/ui/FabIcon";

const meta: Meta<typeof FabIcon> = {
  title: "Components/UI/FabIcon",
  component: FabIcon,
  tags: ["autodocs"],
  argTypes: {
    icon: {
      control: "text",
      description: "Icon name",
    },
    "aria-label": {
      control: "text",
      description: "Accessible name (required: the button has no text)",
    },
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "ghost", "danger"],
      description: "Button role",
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
      description: "Square size: 32, 40 or 48px",
    },
    disabled: {
      control: "boolean",
      description: "Disable the fab icon",
    },
  },
};

export default meta;
type Story = StoryObj<typeof FabIcon>;

export const Primary: Story = {
  args: {
    icon: "upload",
    "aria-label": "Carica export",
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    icon: "singleArrowLeft",
    "aria-label": "Pagina precedente",
    variant: "secondary",
  },
};

export const Ghost: Story = {
  args: {
    icon: "menu",
    "aria-label": "Apri menu",
    variant: "ghost",
  },
};

export const Danger: Story = {
  args: {
    icon: "trash",
    "aria-label": "Rimuovi file",
    variant: "danger",
  },
};

export const AllVariants: Story = {
  name: "Tutte le varianti",
  render: () => (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "0.75rem",
      }}
    >
      <FabIcon icon="upload" aria-label="Carica export" variant="primary" />
      <FabIcon
        icon="singleArrowLeft"
        aria-label="Pagina precedente"
        variant="secondary"
      />
      <FabIcon icon="menu" aria-label="Apri menu" variant="ghost" />
      <FabIcon icon="trash" aria-label="Rimuovi file" variant="danger" />
      <FabIcon icon="close" aria-label="Chiudi" variant="secondary" size="sm" />
      <FabIcon
        icon="download"
        aria-label="Scarica"
        variant="secondary"
        disabled
      />
    </div>
  ),
};
