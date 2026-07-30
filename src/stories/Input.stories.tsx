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

export const ErrorState: Story = {
  args: {
    placeholder: "Inserisci testo",
    variant: "input",
    hasError: true,
  },
};

export const AllVariants: Story = {
  name: "Tutte le varianti",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div>
        <label
          htmlFor="input-no-error"
          style={{
            display: "block",
            marginBottom: "0.5rem",
            fontSize: "0.875rem",
          }}
        >
          Input (no error)
        </label>
        <Input
          id="input-no-error"
          placeholder="Inserisci testo"
          variant="input"
          hasError={false}
        />
      </div>
      <div>
        <label
          htmlFor="textarea-no-error"
          style={{
            display: "block",
            marginBottom: "0.5rem",
            fontSize: "0.875rem",
          }}
        >
          Textarea (no error)
        </label>
        <Input
          id="textarea-no-error"
          placeholder="Inserisci testo lungo"
          variant="textarea"
          hasError={false}
        />
      </div>
      <div>
        <label
          htmlFor="input-with-error"
          style={{
            display: "block",
            marginBottom: "0.5rem",
            fontSize: "0.875rem",
          }}
        >
          Input (con errore)
        </label>
        <Input
          id="input-with-error"
          placeholder="Inserisci testo"
          variant="input"
          hasError={true}
        />
      </div>
    </div>
  ),
};
