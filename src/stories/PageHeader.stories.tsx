import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../components/ui/Badge";
import { PageHeader } from "../components/ui/PageHeader";

const meta: Meta<typeof PageHeader> = {
  title: "Components/UI/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {
  args: {
    kicker: "Updates",
    title: "What's new in Followoo.",
    description:
      "Every release, newest first: what changed and why it matters to you.",
  },
};

export const WithMeta: Story = {
  args: {
    kicker: "Legal",
    title: "Terms and Conditions",
    meta: (
      <>
        <Badge size="sm">Last updated April 2026</Badge>
        <span>14 sections</span>
      </>
    ),
  },
};

export const Wide: Story = {
  args: {
    kicker: "Encrypted history",
    title: "Your saved analyses",
    description:
      "Every entry is encrypted in your browser before it reaches our servers - only the date is ever stored in the clear.",
    wide: true,
  },
};
