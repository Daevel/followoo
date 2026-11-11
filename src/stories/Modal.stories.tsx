import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../components/ui/Button";
import { Field } from "../components/ui/Field";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";

const meta: Meta<typeof Modal> = {
  title: "Components/UI/Modal",
  component: Modal,
  tags: ["autodocs"],
  args: { labelledBy: "modal-story-title", onClose: () => {} },
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: (args) => (
    <Modal {...args}>
      <div className="flex flex-col gap-4">
        <div>
          <h2
            id="modal-story-title"
            className="text-fg text-lg font-semibold tracking-[-0.015em]"
          >
            Unlock your history
          </h2>
          <p className="text-fg-muted mt-1.5 text-sm leading-6">
            Your saved analyses are encrypted. Enter your passphrase to read
            them on this device.
          </p>
        </div>
        <Field label="Passphrase" htmlFor="modal-story-passphrase">
          <Input id="modal-story-passphrase" type="password" />
        </Field>
        <Button size="lg" className="w-full">
          Unlock
        </Button>
      </div>
    </Modal>
  ),
};
