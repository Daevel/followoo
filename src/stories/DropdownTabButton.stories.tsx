import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { DropdownTabButton } from "../components/ui/DropdownTabButton";

const meta: Meta<typeof DropdownTabButton> = {
  title: "Components/UI/DropdownTabButton",
  component: DropdownTabButton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DropdownTabButton>;

const sampleAnalysis = {
  mutual: [
    { username: "anna", timestamp: 1680000000 },
    { username: "mario", timestamp: 1680001000 },
  ],
  followersOnly: [
    { username: "luca", timestamp: 1680002000 },
    { username: "giulia", timestamp: 1680003000 },
  ],
  unfollowers: [{ username: "paolo", timestamp: 1680004000 }],
  recentUnfollowers: [
    { username: "alice", timestamp: 1680005000 },
    { username: "marco", timestamp: 1680006000 },
  ],
  blocked: [{ username: "sara", timestamp: 1680007000 }],
  restricted: [{ username: "filippo", timestamp: 1680008000 }],
  closeFriends: [{ username: "lucia", timestamp: 1680009000 }],
  hideStoriesFrom: [{ username: "elena", timestamp: 1680010000 }],
};

export const Default: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState("mutual");
    return (
      <DropdownTabButton
        title="Gruppi di relazione"
        activeTab={activeTab}
        analysis={sampleAnalysis}
        setActiveTab={setActiveTab}
      />
    );
  },
};
