import clsx from "clsx";
import { Icon } from "@/components/ui/Icon";
import type { NetworkVolatilityResult } from "@/types/instagram.types";

type NetworkVolatilityCardProps = {
  volatility: NetworkVolatilityResult;
};

function getVolatilityConfig(level: "stable" | "moderate" | "high") {
  const config = {
    stable: {
      icon: "check" as const,
      iconColor: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/30",
      labelColor: "text-primary",
      label: "Stable",
    },
    moderate: {
      icon: "warning" as const,
      iconColor: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30",
      labelColor: "text-yellow-500",
      label: "Moderate",
    },
    high: {
      icon: "singleArrowUp" as const,
      iconColor: "text-accent",
      bgColor: "bg-accent/10",
      borderColor: "border-accent/30",
      labelColor: "text-accent",
      label: "High",
    },
  };

  return config[level];
}

export function NetworkVolatilityCard({
  volatility,
}: NetworkVolatilityCardProps) {
  const config = getVolatilityConfig(volatility.volatilityLevel);

  return (
    <div
      className={clsx(
        "border-foreground/10 flex w-full flex-col rounded-[10px] border bg-white/5 p-5 md:p-6",
        config.borderColor
      )}
    >
      <div className="mb-6 flex flex-col">
        <h3 className="text-foreground text-xl font-semibold">
          Network volatility
        </h3>
        <p className="text-foreground/70 mt-1 text-sm">
          Assess the stability and churn rate of your relationships
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Instability Index */}
        <div className={clsx("flex flex-col rounded-lg p-4", config.bgColor)}>
          <p className="text-foreground/60 text-xs font-semibold tracking-widest uppercase">
            Instability index
          </p>
          <div className="mt-4 flex items-baseline gap-2">
            <p className={clsx("text-3xl font-bold", config.labelColor)}>
              {volatility.instabilityIndex.toFixed(1)}%
            </p>
            <p className="text-foreground/60 text-sm">of following</p>
          </div>
          <p className="text-foreground/70 mt-2 text-xs leading-5">
            Percentage of your following list linked to recent unfollow activity
          </p>
        </div>

        {/* Recent Unfollow Ratio */}
        <div className={clsx("flex flex-col rounded-lg p-4", config.bgColor)}>
          <p className="text-foreground/60 text-xs font-semibold tracking-widest uppercase">
            Recent churn ratio
          </p>
          <div className="mt-4 flex items-baseline gap-2">
            <p className={clsx("text-3xl font-bold", config.labelColor)}>
              {volatility.recentUnfollowRatio.toFixed(1)}%
            </p>
            <p className="text-foreground/60 text-sm">of following gap</p>
          </div>
          <p className="text-foreground/70 mt-2 text-xs leading-5">
            Recent unfollows compared with people you follow who don't follow
            back
          </p>
        </div>

        {/* Volatility Level */}
        <div className={clsx("flex flex-col rounded-lg p-4", config.bgColor)}>
          <p className="text-foreground/60 text-xs font-semibold tracking-widest uppercase">
            Assessment
          </p>
          <div className="mt-4 flex items-center gap-3">
            <Icon
              name={config.icon}
              width={24}
              height={24}
              className={config.iconColor}
            />
            <p className={clsx("text-xl font-bold", config.labelColor)}>
              {config.label}
            </p>
          </div>
        </div>
      </div>

      {/* Insight */}
      <div className="border-foreground/10 bg-foreground/5 mt-6 flex flex-row rounded-lg border p-4">
        <p className="text-foreground text-sm leading-6">
          {volatility.insight}
        </p>
      </div>
    </div>
  );
}
