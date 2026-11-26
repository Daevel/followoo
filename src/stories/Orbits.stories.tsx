import type { Meta, StoryObj } from "@storybook/react-vite";
import { Orbits } from "../components/ui/Orbits";

const meta: Meta<typeof Orbits> = {
  title: "Components/UI/Orbits",
  component: Orbits,
  tags: ["autodocs"],
  argTypes: {
    size: { control: { type: "number" }, description: "Lato in px" },
    dotScale: {
      control: { type: "number", step: 0.1 },
      description: "Moltiplicatore dei puntini",
    },
    spinning: {
      control: "boolean",
      description: "Rotazione infinita (spenta su telefono)",
    },
  },
  args: { size: 320, dotScale: 1, spinning: true },
};

export default meta;
type Story = StoryObj<typeof Orbits>;

export const Spinning: Story = {};

export const Still: Story = { args: { spinning: false } };
