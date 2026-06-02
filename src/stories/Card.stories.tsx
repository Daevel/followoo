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
    color: {
      control: { type: "select" },
      options: ["primary", "accent", "bg", "foreground"],
      description: "Card color variant",
    },
    iconName: {
      control: "text",
      description: "Icon name",
    },
    opacity: {
      control: "boolean",
      description: "Apply backdrop blur effect",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Primary: Story = {
  args: {
    title: "Crescita sicura",
    description: "Una card compatta con icona e testo.",
    color: "primary",
    iconName: "shield",
  },
};

export const Accent: Story = {
  args: {
    title: "Crescita sicura",
    description: "Una card compatta con icona e testo.",
    color: "accent",
    iconName: "shield",
  },
};

export const Bg: Story = {
  args: {
    title: "Crescita sicura",
    description: "Una card compatta con icona e testo.",
    color: "bg",
    iconName: "shield",
  },
};

export const Foreground: Story = {
  args: {
    title: "Crescita sicura",
    description: "Una card compatta con icona e testo.",
    color: "foreground",
    iconName: "shield",
  },
};

export const AllVariants: Story = {
  name: "Tutte le varianti",
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "1rem",
      }}
    >
      <Card
        title="Primary"
        description="Card con colore primary"
        color="primary"
        iconName="shield"
      />
      <Card
        title="Accent"
        description="Card con colore accent"
        color="accent"
        iconName="shield"
      />
      <Card
        title="Bg"
        description="Card con colore bg"
        color="bg"
        iconName="shield"
      />
      <Card
        title="Foreground"
        description="Card con colore foreground"
        color="foreground"
        iconName="shield"
      />
    </div>
  ),
};
