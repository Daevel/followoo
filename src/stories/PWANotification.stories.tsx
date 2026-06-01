import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { PWANotification } from "../components/ui/PWANotification";

const meta: Meta<typeof PWANotification> = {
  title: "Components/UI/PWANotification",
  component: PWANotification,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PWANotification>;

export const Default: Story = {
  render: () => {
    const [visible, setVisible] = useState(true);

    if (!visible) {
      return <div className="text-foreground">PWA Notification dismissato</div>;
    }

    return (
      <PWANotification
        onInstall={() => console.log("Install PWA")}
        onDismiss={() => setVisible(false)}
      />
    );
  },
};
