import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Toast, type ToastItem } from "../components/ui/Toast";

const meta: Meta<typeof Toast> = {
  title: "Components/UI/Toast",
  component: Toast,
  tags: ["autodocs"],
  argTypes: {
    duration: {
      control: { type: "number" },
      description: "Duration in milliseconds",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

const infoToast: ToastItem = {
  id: "toast-info",
  title: "Messaggio informativo",
  description: "Qui è riportata una informazione per te.",
  variant: "info",
};

const successToast: ToastItem = {
  id: "toast-success",
  title: "Successo",
  description: "L'operazione è stata completata con successo.",
  variant: "success",
};

const warningToast: ToastItem = {
  id: "toast-warning",
  title: "Avvertimento",
  description: "Si prega di controllare le informazioni di cui sopra.",
  variant: "warning",
};

export const Info: Story = {
  render: () => {
    const [visible, setVisible] = useState(true);
    return visible ? (
      <Toast
        toast={infoToast}
        onClose={() => setVisible(false)}
        duration={10000}
      />
    ) : (
      <div className="text-foreground">Toast chiuso</div>
    );
  },
};

export const Success: Story = {
  render: () => {
    const [visible, setVisible] = useState(true);
    return visible ? (
      <Toast
        toast={successToast}
        onClose={() => setVisible(false)}
        duration={10000}
      />
    ) : (
      <div className="text-foreground">Toast chiuso</div>
    );
  },
};

export const Warning: Story = {
  render: () => {
    const [visible, setVisible] = useState(true);
    return visible ? (
      <Toast
        toast={warningToast}
        onClose={() => setVisible(false)}
        duration={10000}
      />
    ) : (
      <div className="text-foreground">Toast chiuso</div>
    );
  },
};
