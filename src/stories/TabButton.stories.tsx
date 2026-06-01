import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { TabButton } from "../components/ui/TabButton";

const meta: Meta<typeof TabButton> = {
  title: "Components/UI/TabButton",
  component: TabButton,
  tags: ["autodocs"],
  argTypes: {
    active: {
      control: "boolean",
      description: "Whether the tab is active",
    },
    children: {
      control: "text",
      description: "Tab button label",
    },
  },
};

export default meta;
type Story = StoryObj<typeof TabButton>;

export const Active: Story = {
  render: () => {
    const [isActive, setIsActive] = useState(true);
    return (
      <TabButton active={isActive} onClick={() => setIsActive(!isActive)}>
        Tab attivo
      </TabButton>
    );
  },
};

export const Inactive: Story = {
  render: () => {
    const [isActive, setIsActive] = useState(false);
    return (
      <TabButton active={isActive} onClick={() => setIsActive(!isActive)}>
        Tab inattivo
      </TabButton>
    );
  },
};
