import type { Meta, StoryObj } from "@storybook/react-vite";
import { AnalysisLoading } from "../features/instagram-export/components/AnalysisLoading";

const meta: Meta<typeof AnalysisLoading> = {
  title: "Components/UI/AnalysisLoading",
  component: AnalysisLoading,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    counts: {
      control: "object",
      description:
        "Conteggi dei tre gruppi a fine analisi; null mentre l'analisi è in corso (la rete continua a girare al 90%).",
    },
    avatarUrl: {
      control: "text",
      description:
        "Foto del profilo dell'account Followoo (Clerk). Senza foto, al centro resta il fantasmino.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof AnalysisLoading>;

export const AnalysisLoadingStory: Story = {
  name: "AnalysisLoading",
  args: {
    counts: { mutual: 801, followersOnly: 447, unfollowers: 179 },
    avatarUrl: null,
  },
};
