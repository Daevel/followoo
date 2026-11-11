import type { Meta, StoryObj } from "@storybook/react-vite";
import { NetworkVolatilityCard } from "../components/ui/charts/NetworkVolatilityCard";
import type { NetworkVolatilityResult } from "../types/instagram.types";

const meta: Meta<typeof NetworkVolatilityCard> = {
  title: "Components/UI/Charts/NetworkVolatilityCard",
  component: NetworkVolatilityCard,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof NetworkVolatilityCard>;

const stable: NetworkVolatilityResult = {
  instabilityIndex: 2.4,
  recentUnfollowRatio: 6.1,
  volatilityLevel: "stable",
  insight: "La tua rete è stabile: pochi unfollow recenti rispetto ai seguiti.",
};

const moderate: NetworkVolatilityResult = {
  instabilityIndex: 7.8,
  recentUnfollowRatio: 18.5,
  volatilityLevel: "moderate",
  insight: "Qualche cambiamento recente: tieni d'occhio i prossimi export.",
};

const high: NetworkVolatilityResult = {
  instabilityIndex: 14.2,
  recentUnfollowRatio: 41.3,
  volatilityLevel: "high",
  insight: "Molti unfollow recenti rispetto a chi non ti segue indietro.",
};

export const Stable: Story = { args: { volatility: stable } };

export const Moderate: Story = { args: { volatility: moderate } };

export const High: Story = { args: { volatility: high } };

export const AllVariants: Story = {
  name: "Tutte le varianti",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <NetworkVolatilityCard volatility={stable} />
      <NetworkVolatilityCard volatility={moderate} />
      <NetworkVolatilityCard volatility={high} />
    </div>
  ),
};
