import type { Meta, StoryObj } from "@storybook/react-vite";
import { Callout } from "../components/ui/Callout";

const meta: Meta<typeof Callout> = {
  title: "Components/UI/Callout",
  component: Callout,
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Callout title",
    },
    variant: {
      control: { type: "select" },
      options: ["info", "warning", "success"],
      description: "Callout variant",
    },
    children: {
      control: "text",
      description: "Callout content",
    },
    icon: {
      control: "text",
      description: "Optional icon name",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Callout>;

export const Info: Story = {
  args: {
    title: "Informazione",
    variant: "info",
    children: "Questo è un componente callout per informazioni importanti.",
  },
};

export const Warning: Story = {
  args: {
    title: "Avvertimento",
    variant: "warning",
    children: "Si prega di controllare le informazioni di cui sopra.",
  },
};

export const Success: Story = {
  args: {
    title: "Successo",
    variant: "success",
    children: "L'operazione è stata completata con successo.",
  },
};

export const AllVariants: Story = {
  name: "Tutte le varianti",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Callout title="Informazione" variant="info">
        Questo è un componente callout per informazioni importanti.
      </Callout>
      <Callout title="Avvertimento" variant="warning">
        Si prega di controllare le informazioni di cui sopra.
      </Callout>
      <Callout title="Successo" variant="success">
        L'operazione è stata completata con successo.
      </Callout>
    </div>
  ),
};
