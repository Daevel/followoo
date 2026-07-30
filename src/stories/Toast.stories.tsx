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
      description: "Durata in millisecondi",
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

export const InfoVariant: Story = {
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

export const SuccessVariant: Story = {
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

export const WarningVariant: Story = {
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

export const AllVariants: Story = {
  name: "Tutte le varianti",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Toast toast={infoToast} onClose={() => {}} duration={10000} />
      <Toast toast={successToast} onClose={() => {}} duration={10000} />
      <Toast toast={warningToast} onClose={() => {}} duration={10000} />
    </div>
  ),
};
