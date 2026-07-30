import type { Meta, StoryObj } from "@storybook/react-vite";
import { Container } from "../components/ui/Container";

const meta: Meta<typeof Container> = {
  title: "Components/UI/Container",
  component: Container,
  tags: ["autodocs"],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Container>;

export const Container_: Story = {
  args: {
    children: "Questo contenuto è avvolto dal componente Container.",
  },
};
