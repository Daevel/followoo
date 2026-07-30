import type { Meta, StoryObj } from "@storybook/react-vite";
import { HeroIllustrations } from "../components/ui/HeroIllustrations";

const meta: Meta<typeof HeroIllustrations> = {
  title: "Components/UI/HeroIllustrations",
  component: HeroIllustrations,
  tags: ["autodocs"],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof HeroIllustrations>;

export const HeroIllustrations_: Story = {};
