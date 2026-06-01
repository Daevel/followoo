import type { Meta, StoryObj } from "@storybook/react-vite";
import { NavBar } from "../components/ui/NavBar";

const meta: Meta<typeof NavBar> = {
  title: "Components/UI/NavBar",
  component: NavBar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof NavBar>;

export const Default: Story = {};
