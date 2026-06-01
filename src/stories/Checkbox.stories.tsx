import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "../components/ui/Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Components/UI/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Checkbox label",
    },
    hasError: {
      control: "boolean",
      description: "Show error state",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    label: "Opzione",
    hasError: false,
  },
};

export const WithError: Story = {
  args: {
    label: "Opzione",
    hasError: true,
  },
};
