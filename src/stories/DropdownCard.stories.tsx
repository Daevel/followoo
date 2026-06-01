import type { Meta, StoryObj } from "@storybook/react-vite";
import { DropdownCard } from "../components/ui/DropdownCard";

const meta: Meta<typeof DropdownCard> = {
  title: "Components/UI/DropdownCard",
  component: DropdownCard,
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
  },
};

export default meta;
type Story = StoryObj<typeof DropdownCard>;

export const Default: Story = {
  args: {
    title: "Ulteriori dettagli",
    description: "Il contenuto dettagliato appare quando la card è espansa.",
  },
};
