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
      description: "Numero pagina corrente",
    },
    totalPages: {
      control: { type: "number" },
      description: "Numero pagine totali",
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

export const AllVariants: Story = {
  name: "Tutte le varianti",
  render: () => {
    const [page1, setPage1] = useState(1);
    const [page2, setPage2] = useState(5);
    const [page3, setPage3] = useState(8);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <div>
          <p style={{ marginBottom: "0.5rem" }}>Prima pagina</p>
          <Paginator
            currentPage={page1}
            totalPages={10}
            onPageChange={setPage1}
          />
        </div>
        <div>
          <p style={{ marginBottom: "0.5rem" }}>Ultima pagina</p>
          <Paginator
            currentPage={page2}
            totalPages={5}
            onPageChange={setPage2}
          />
        </div>
        <div>
          <p style={{ marginBottom: "0.5rem" }}>Pagina intermedia</p>
          <Paginator
            currentPage={page3}
            totalPages={15}
            onPageChange={setPage3}
          />
        </div>
      </div>
    );
  },
};
