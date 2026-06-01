import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Paginator } from "../components/ui/Paginator";

const meta: Meta<typeof Paginator> = {
  title: "Components/UI/Paginator",
  component: Paginator,
  tags: ["autodocs"],
  argTypes: {
    currentPage: {
      control: { type: "number" },
      description: "Current page number",
    },
    totalPages: {
      control: { type: "number" },
      description: "Total number of pages",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Paginator>;

export const Default: Story = {
  render: () => {
    const [page, setPage] = useState(2);
    return (
      <Paginator currentPage={page} totalPages={8} onPageChange={setPage} />
    );
  },
};

export const FirstPage: Story = {
  args: {
    currentPage: 1,
    totalPages: 5,
  },
  render: (args) => {
    const [page, setPage] = useState(1);
    return <Paginator {...args} currentPage={page} onPageChange={setPage} />;
  },
};

export const LastPage: Story = {
  args: {
    currentPage: 5,
    totalPages: 5,
  },
  render: (args) => {
    const [page, setPage] = useState(5);
    return <Paginator {...args} currentPage={page} onPageChange={setPage} />;
  },
};
