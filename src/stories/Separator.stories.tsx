import type { Meta, StoryObj } from "@storybook/react-vite";
import { Separator } from "../components/ui/Separator";

const meta: Meta<typeof Separator> = {
  title: "Components/UI/Separator",
  component: Separator,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "accent", "foreground"],
      description: "Colore separatore",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Primary: Story = {
  args: {
    variant: "primary",
  },
};

export const Accent: Story = {
  args: {
    variant: "accent",
  },
};

export const Foreground: Story = {
  args: {
    variant: "foreground",
  },
};

export const AllVariants: Story = {
  name: "Tutte le varianti",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div>
        <p>Top content</p>
        <Separator variant="primary" />
        <p>Bottom content</p>
      </div>
      <div>
        <p>Top content</p>
        <Separator variant="accent" />
        <p>Bottom content</p>
      </div>
      <div>
        <p>Top content</p>
        <Separator variant="foreground" />
        <p>Bottom content</p>
      </div>
    </div>
  ),
};
