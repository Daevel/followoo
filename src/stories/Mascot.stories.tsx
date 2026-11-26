import type { Meta, StoryObj } from "@storybook/react-vite";
import { Mascot, type MascotPose } from "../components/ui/Mascot";

const poses: { pose: MascotPose; use: string }[] = [
  { pose: "wave", use: "Home: saluta dall'angolo della finestra" },
  { pose: "happy", use: "Default; home su telefono" },
  { pose: "think", use: "Caricamento, al centro delle orbite" },
  { pose: "cheer", use: "Risultati: follow-back rate alto" },
  { pose: "curious", use: "Risultati: follow-back rate medio o basso" },
  { pose: "search", use: "Ricerca senza risultati" },
  { pose: "party", use: "Lista vuota per un buon motivo" },
  { pose: "sleep", use: "Niente da mostrare" },
  { pose: "oops", use: "Errore, pagina 404" },
];

const meta: Meta<typeof Mascot> = {
  title: "Components/UI/Mascot",
  component: Mascot,
  tags: ["autodocs"],
  argTypes: {
    pose: {
      control: { type: "select" },
      options: poses.map((item) => item.pose),
      description: "Posa: una per ogni momento dell'app",
    },
    size: { control: { type: "number" }, description: "Lato in px" },
    animated: {
      control: "boolean",
      description: "Galleggia, sbatte le palpebre e saluta",
    },
  },
  args: { pose: "happy", size: 120, animated: true },
};

export default meta;
type Story = StoryObj<typeof Mascot>;

export const Playground: Story = {};

export const AllPoses: Story = {
  render: (args) => (
    <div className="grid grid-cols-3 gap-6 sm:grid-cols-5">
      {poses.map(({ pose, use }) => (
        <figure
          key={pose}
          className="flex flex-col items-center gap-2 text-center"
        >
          <Mascot {...args} pose={pose} size={96} />
          <figcaption className="text-fg-muted text-xs">
            <span className="text-fg font-medium">{pose}</span>
            <br />
            {use}
          </figcaption>
        </figure>
      ))}
    </div>
  ),
};
