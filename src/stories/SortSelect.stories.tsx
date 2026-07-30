import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { SortSelect } from "../components/ui/SortSelect";

const meta: Meta<typeof SortSelect> = {
  title: "Components/UI/SortSelect",
  component: SortSelect,
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Etichetta select",
    },
    value: {
      control: { type: "select" },
      options: ["recent", "oldest", "popular"],
      description: "Valore selezionato",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SortSelect>;

const options = [
  { label: "Più recenti", value: "recent" as const },
  { label: "Meno recenti", value: "oldest" as const },
  { label: "Più popolari", value: "popular" as const },
];

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<"recent" | "oldest" | "popular">(
      "recent"
    );
    return <SortSelect value={value} options={options} onChange={setValue} />;
  },
};

export const WithLabel: Story = {
  render: () => {
    const [value, setValue] = useState<"recent" | "oldest" | "popular">(
      "recent"
    );
    return (
      <SortSelect
        label="Ordina per"
        value={value}
        options={options}
        onChange={setValue}
      />
    );
  },
};
