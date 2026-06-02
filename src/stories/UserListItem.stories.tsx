import type { Meta, StoryObj } from "@storybook/react-vite";
import { UserListItem } from "../components/ui/UserListItem";

const meta: Meta<typeof UserListItem> = {
  title: "Components/UI/UserListItem",
  component: UserListItem,
  tags: ["autodocs"],
  argTypes: {},
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
  },
};

export const WithPersona: Story = {
  args: {
    user: sampleUser,
    formatDate: (timestamp) =>
      timestamp ? new Date(timestamp * 1000).toLocaleDateString("it-IT") : null,
    persona: "engaged",
  },
};
