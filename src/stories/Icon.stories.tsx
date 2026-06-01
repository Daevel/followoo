import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "../components/ui/Icon";

const allIconNames = [
  "check",
  "close",
  "shield",
  "menu",
  "upload",
  "warning",
  "help",
  "eye",
  "code",
  "linkOff",
  "download",
  "happyFace",
  "neutralFace",
] as const;

const meta: Meta<typeof Icon> = {
  title: "Components/UI/Icon",
  component: Icon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: { type: "select" },
      options: allIconNames,
      description: "Icon name",
    },
    color: {
      control: { type: "select" },
      options: ["primary", "accent", "bg", "foreground"],
      description: "Icon color",
    },
    width: {
      control: { type: "number" },
      description: "Icon width",
    },
    height: {
      control: { type: "number" },
      description: "Icon height",
    },
    title: {
      control: "text",
      description: "SVG title attribute",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Primary: Story = {
  args: {
    name: "check",
    color: "primary",
    width: 32,
    height: 32,
  },
};

export const Gallery: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      {allIconNames.map((name) => (
        <div
          key={name}
          className="border-foreground/10 bg-foreground/5 rounded-xl border p-4 text-center"
        >
          <Icon name={name} width={32} height={32} />
          <p className="mt-3 text-sm">{name}</p>
        </div>
      ))}
    </div>
  ),
};
