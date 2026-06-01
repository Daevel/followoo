import type { Meta, StoryObj } from "@storybook/react-vite";
import { FooterSignature } from "../components/ui/FooterSignature";

const meta: Meta<typeof FooterSignature> = {
  title: "Components/UI/FooterSignature",
  component: FooterSignature,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FooterSignature>;

export const Default: Story = {};
