import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "../components/ui/Skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "Components/UI/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
      description: "Grandezza skeleton",
    },
    shape: {
      control: { type: "select" },
      options: ["circle", "rectangle"],
      description: "Forma skeleton",
    },
    animation: {
      control: { type: "select" },
      options: ["pulse", "wave"],
      description: "Tipo di animazione",
    },
    ariaLabel: {
      control: "text",
      description: "Etichetta aria",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const RectangleSmall: Story = {
  args: {
    size: "sm",
    shape: "rectangle",
    animation: "wave",
    ariaLabel: "Loading content",
  },
};

export const RectangleMedium: Story = {
  args: {
    size: "md",
    shape: "rectangle",
    animation: "wave",
    ariaLabel: "Loading content",
  },
};

export const RectangleLarge: Story = {
  args: {
    size: "lg",
    shape: "rectangle",
    animation: "wave",
    ariaLabel: "Loading content",
  },
};

export const CircleSmall: Story = {
  args: {
    size: "sm",
    shape: "circle",
    animation: "wave",
    ariaLabel: "Loading content",
  },
};

export const CircleMedium: Story = {
  args: {
    size: "md",
    shape: "circle",
    animation: "wave",
    ariaLabel: "Loading content",
  },
};

export const CircleLarge: Story = {
  args: {
    size: "lg",
    shape: "circle",
    animation: "wave",
    ariaLabel: "Loading content",
  },
};

export const WithPulseAnimation: Story = {
  args: {
    size: "md",
    shape: "rectangle",
    animation: "pulse",
    ariaLabel: "Loading content",
  },
};

export const AllVariants: Story = {
  name: "Tutte le varianti",
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "1rem",
      }}
    >
      <Skeleton
        size="sm"
        shape="rectangle"
        animation="wave"
        ariaLabel="Loading"
      />
      <Skeleton
        size="md"
        shape="rectangle"
        animation="wave"
        ariaLabel="Loading"
      />
      <Skeleton
        size="lg"
        shape="rectangle"
        animation="wave"
        ariaLabel="Loading"
      />
      <Skeleton size="sm" shape="circle" animation="wave" ariaLabel="Loading" />
      <Skeleton size="md" shape="circle" animation="wave" ariaLabel="Loading" />
      <Skeleton size="lg" shape="circle" animation="wave" ariaLabel="Loading" />
      <Skeleton
        size="md"
        shape="rectangle"
        animation="pulse"
        ariaLabel="Loading"
      />
      <Skeleton
        size="md"
        shape="circle"
        animation="pulse"
        ariaLabel="Loading"
      />
    </div>
  ),
};
