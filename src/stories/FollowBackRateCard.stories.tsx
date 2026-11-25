import type { Meta, StoryObj } from "@storybook/react-vite";
import { FollowBackRateCard } from "../components/ui/FollowBackRateCard";

const meta: Meta<typeof FollowBackRateCard> = {
  title: "Components/UI/FollowBackRateCard",
  component: FollowBackRateCard,
  tags: ["autodocs"],
  argTypes: {
    result: {
      control: "object",
      description:
        "Esito del follow-back rate: percentuale, livello (balanced, roomToImprove, oneWay, noData) e testi.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof FollowBackRateCard>;

export const FollowBackRateCardStory: Story = {
  name: "FollowBackRateCard",
  args: {
    result: {
      rate: 50,
      level: "roomToImprove",
      label: "Room to improve",
      mutualCount: 5,
      followingCount: 10,
      summary: "5 of the 10 people you follow follow you back.",
      hint: "Review who doesn't follow you back and keep only the accounts you care about.",
    },
  },
};
