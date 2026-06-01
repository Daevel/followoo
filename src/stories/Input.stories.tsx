import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "../components/ui/Input";

const meta: Meta<typeof Input> = {
  title: "Components/UI/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    placeholder: {
      control: "text",
      description: "Input placeholder",
    },
    variant: {
      control: { type: "select" },
      options: ["input", "textarea"],
      description: "Input variant type",
    },
    maxLength: {
      control: { type: "number" },
      description: "Maximum characters allowed",
    },
    hasError: {
      control: "boolean",
      description: "Show error state",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const TextInput: Story = {
  args: {
    placeholder: "Inserisci testo",
    variant: "input",
    hasError: false,
  },
};

export const Textarea: Story = {
  args: {
    placeholder: "Inserisci testo lungo",
    variant: "textarea",
    hasError: false,
  },
};

export const WithError: Story = {
  args: {
    placeholder: "Inserisci testo",
    variant: "input",
    hasError: true,
  },
};
