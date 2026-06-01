import type { Meta, StoryObj } from "@storybook/react-vite";
import { HeroSection } from "../components/ui/hero-subsection/HeroSection";

const meta: Meta<typeof HeroSection> = {
  title: "Components/UI/HeroSection",
  component: HeroSection,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof HeroSection>;

export const Default: Story = {};
