import type { Meta, StoryObj } from "@storybook/react-vite";
import { UserListItem } from "../components/ui/UserListItem";

const meta: Meta<typeof UserListItem> = {
  title: "Components/UI/UserListItem",
  component: UserListItem,
  tags: ["autodocs"],
  argTypes: {
    badges: {
      control: "object",
      description:
        'Fatti presi dalle altre liste, mostrati come badge (es. "Close Friend").',
    },
  },
};

export default meta;
type Story = StoryObj<typeof UserListItem>;

const sampleUser = {
  username: "john_doe",
  timestamp: 1680012000,
};

export const UserListItem_: Story = {
  args: {
    user: sampleUser,
    formatDate: (timestamp) =>
      timestamp ? new Date(timestamp * 1000).toLocaleDateString("it-IT") : null,
    badges: ["Close Friend"],
  },
};

/**
 * Badge con spiegazione: su desktop il fumetto si apre al passaggio del
 * mouse (o con il focus da tastiera), su telefono la spiegazione è scritta
 * accanto al badge.
 */
export const RenamedBadge: Story = {
  args: {
    user: { username: "luca.shoots_film", timestamp: 1767867120 },
    formatDate: (timestamp) =>
      timestamp
        ? new Date(timestamp * 1000).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : null,
    datePrefix: "Follows you since",
    badges: [
      { label: "Renamed", hint: "Previously @luca.photos" },
      "Close Friend",
    ],
  },
};
