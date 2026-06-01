import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScrollToTop } from "../components/ui/ScrollToTop";

const meta: Meta<typeof ScrollToTop> = {
  title: "Components/UI/ScrollToTop",
  component: ScrollToTop,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ScrollToTop>;

export const Default: Story = {};
