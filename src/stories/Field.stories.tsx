import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field } from "../components/ui/Field";
import { Input } from "../components/ui/Input";

const meta: Meta<typeof Field> = {
  title: "Components/UI/Field",
  component: Field,
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Etichetta del campo",
    },
    hint: {
      control: "text",
      description: "Testo di aiuto sotto il campo",
    },
    error: {
      control: "text",
      description: "Messaggio di errore (sostituisce l'aiuto)",
    },
    meta: {
      control: "text",
      description: "Info a destra, es. contatore caratteri",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Field>;

export const FieldStory: Story = {
  name: "Field",
  args: {
    label: "Email",
    htmlFor: "field-email",
    hint: "Solo per l'account, mai per l'analisi.",
  },
  render: (args) => (
    <div style={{ maxWidth: "24rem" }}>
      <Field {...args}>
        <Input
          id="field-email"
          type="email"
          placeholder="nome@esempio.com"
          hasError={!!args.error}
        />
      </Field>
    </div>
  ),
};
