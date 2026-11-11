import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Icon, type IconName } from "@/components/ui/Icon";
import type { NetworkVolatilityResult } from "@/types/instagram.types";
import { ChartCard, ChartStats } from "./ChartCard";

type NetworkVolatilityCardProps = {
  volatility: NetworkVolatilityResult;
};

// Level as icon + word in a badge; the numbers stay in neutral text.
const levelStyles: Record<
  "stable" | "moderate" | "high",
  { label: string; icon: IconName; tone: BadgeTone }
> = {
  stable: { label: "Stable", icon: "check", tone: "success" },
  moderate: { label: "Moderate", icon: "warning", tone: "warning" },
  high: { label: "High", icon: "singleArrowUp", tone: "danger" },
};

export function NetworkVolatilityCard({
  volatility,
}: NetworkVolatilityCardProps) {
  const { label, icon, tone } = levelStyles[volatility.volatilityLevel];

  return (
    <ChartCard
      title="Network volatility"
      description="Assess the stability and churn rate of your relationships."
    >
      <ChartStats
        stats={[
          {
            label: "Instability index",
            value: `${volatility.instabilityIndex.toFixed(1)}%`,
            detail:
              "Percentage of your following list linked to recent unfollow activity",
          },
          {
            label: "Recent churn ratio",
            value: `${volatility.recentUnfollowRatio.toFixed(1)}%`,
            detail:
              "Recent unfollows compared with people you follow who don't follow back",
          },
          {
            label: "Assessment",
            value: (
              <Badge
                tone={tone}
                icon={
                  <Icon
                    name={icon}
                    color="current"
                    width={12}
                    height={12}
                    aria-hidden="true"
                  />
                }
              >
                {label}
              </Badge>
            ),
          },
        ]}
      />

      <p className="text-fg-muted text-[13px] leading-[1.6]">
        {volatility.insight}
      </p>
    </ChartCard>
  );
}
