import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ZipDropzone } from "../components/ui/ZipDropzone";

const meta: Meta<typeof ZipDropzone> = {
  title: "Components/UI/ZipDropzone",
  component: ZipDropzone,
  tags: ["autodocs"],
  argTypes: {
    file: {
      description: "Selected file",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ZipDropzone>;

export const Default: Story = {
  render: () => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState("");

    return (
      <div>
        <ZipDropzone file={file} onFileChange={setFile} onError={setError} />
        {error && <p className="text-accent mt-3 text-sm">{error}</p>}
        {file && (
          <p className="text-primary mt-3 text-sm">
            File selezionato: {file.name}
          </p>
        )}
      </div>
    );
  },
};

export const WithError: Story = {
  render: () => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState("Il file deve essere un ZIP valido");

    return (
      <div>
        <ZipDropzone file={file} onFileChange={setFile} onError={setError} />
        {error && <p className="text-accent mt-3 text-sm">{error}</p>}
      </div>
    );
  },
};
