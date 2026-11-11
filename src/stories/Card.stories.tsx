import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "../components/ui/Card";

const meta: Meta<typeof Card> = {
  title: "Components/UI/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Card title",
    },
    description: {
      control: "text",
      description: "Card description",
    },
    tone: {
      control: { type: "select" },
      options: ["default", "brand"],
      description: "Icon tile tone (the surface stays neutral)",
    },
    iconName: {
      control: "text",
      description: "Icon name",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    title: "Elaborazione locale",
    description: "Il calcolo avviene interamente nel tuo browser.",
    tone: "default",
    iconName: "laptop",
  },
};

export const Brand: Story = {
  args: {
    title: "Privata per impostazione",
    description: "L'export viene analizzato nel tuo browser. Nessun upload.",
    tone: "brand",
    iconName: "shield",
  },
};

export const AllVariants: Story = {
  name: "Tutte le varianti",
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: "1rem",
      }}
    >
      <Card
        title="Elaborazione locale"
        description="Il calcolo avviene interamente nel tuo browser."
        tone="default"
        iconName="laptop"
      />
      <Card
        title="Privata per impostazione"
        description="L'export viene analizzato nel tuo browser. Nessun upload."
        tone="brand"
        iconName="shield"
      />
    </div>
  ),
};
