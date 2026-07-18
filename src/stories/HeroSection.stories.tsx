import type { Meta, StoryObj } from "@storybook/react-vite";
import { HeroSection } from "@/features/landing/components/HeroSection";

const meta: Meta<typeof HeroSection> = {
  title: "Components/UI/HeroSection",
  component: HeroSection,
  tags: ["autodocs"],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof HeroSection>;

export const HeroSection_: Story = {};
