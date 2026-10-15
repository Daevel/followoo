import type { Meta, StoryObj } from "@storybook/react-vite";
import { Separator } from "../components/ui/Separator";

const meta: Meta<typeof Separator> = {
  title: "Components/UI/Separator",
  component: Separator,
  tags: ["autodocs"],
  argTypes: {
    className: {
      control: "text",
      description: "Spaziatura decisa dal contenitore, es. my-8",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const SeparatorStory: Story = {
  name: "Separator",
  render: (args) => (
    <div>
      <p>Contenuto sopra</p>
      <Separator className="my-6" {...args} />
      <p>Contenuto sotto</p>
    </div>
  ),
};
