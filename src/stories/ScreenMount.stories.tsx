import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "../components/ui/Card";
import { ScreenMount } from "../components/ui/ScreenMount";

const meta: Meta<typeof ScreenMount> = {
  title: "Components/UI/ScreenMount",
  component: ScreenMount,
  tags: ["autodocs"],
  argTypes: {
    position: {
      control: { type: "select" },
      options: [
        "top-left",
        "top-right",
        "bottom-left",
        "bottom-right",
        "top-center",
        "bottom-center",
        "center",
      ],
      description: "Position on screen",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ScreenMount>;

export const BottomLeft: Story = {
  args: {
    position: "bottom-left",
    children: (
      <Card
        title="Card flottante"
        description="Una card montata tramite ScreenMount, completa di posizione fissa sullo schermo."
        iconName="happyFace"
      />
    ),
  },
};

export const BottomRight: Story = {
  args: {
    position: "bottom-right",
    children: (
      <Card
        title="Card flottante"
        description="Una card montata tramite ScreenMount, completa di posizione fissa sullo schermo."
        iconName="happyFace"
      />
    ),
  },
};

export const Center: Story = {
  args: {
    position: "center",
    children: (
      <Card
        title="Card flottante"
        description="Una card montata tramite ScreenMount, completa di posizione fissa sullo schermo."
        iconName="happyFace"
      />
    ),
  },
};
