import clsx from "clsx";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  calculateEngagementPattern,
  type EngagementPatternResult,
  type EngagementPeriod,
} from "@/components/services/engagementPatternService";
import { Icon } from "@/components/ui/Icon";
import type { InstagramUser } from "@/types/instagram.types";

type EngagementPatternChartProps = {
  recentUnfollowers: InstagramUser[];
};

function TrendIcon({
  trend,
}: {
  trend: "increasing" | "decreasing" | "stable";
}) {
  const config = {
    increasing: {
      color: "text-accent",
      icon: "singleArrowUp" as const,
      label: "Increasing",
    },
    decreasing: {
      color: "text-primary",
      icon: "singleArrowDown" as const,
      label: "Decreasing",
    },
    stable: {
      color: "text-foreground",
      icon: "check" as const,
      label: "Stable",
    },
  };

  const { color, icon, label } = config[trend];

  return (
    <div className="flex items-center gap-2">
      <Icon name={icon} width={16} height={16} className={color} />
      <span className={clsx("text-sm font-medium", color)}>{label}</span>
    </div>
  );
}

export function EngagementPatternChart({
  recentUnfollowers,
}: EngagementPatternChartProps) {
  const [period, setPeriod] = useState<EngagementPeriod>("month");

  const patternResult: EngagementPatternResult = useMemo(
    () => calculateEngagementPattern(recentUnfollowers, period),
    [recentUnfollowers, period]
  );

  type ChartDataPoint = {
    period: string;
    count: number;
    percentage: number;
  };

  const chartData: ChartDataPoint[] = patternResult.data.map((point) => ({
    period: point.period,
    count: point.count,
    percentage: parseFloat(point.percentage.toFixed(1)),
  }));

  return (
    <div className="border-foreground/10 flex w-full flex-col justify-between rounded-[10px] border bg-white/5 p-5 md:p-6">
      <div className="mb-6 flex flex-col">
        <h3 className="text-foreground text-xl font-semibold">
          Engagement pattern
        </h3>
        <p className="text-foreground/70 mt-1 text-sm">
          Visualize when you lose followers over time
        </p>
      </div>

      {/* Period selector */}
      <div className="mb-6 flex flex-row justify-center gap-3">
        {(["month", "week"] as const).map((p) => (
          <button
            type="button"
            key={p}
            onClick={() => setPeriod(p)}
            className={clsx(
              "rounded-lg px-4 py-2 text-sm font-medium transition-all",
              period === p
                ? "bg-primary/20 text-primary border-primary/30 border"
                : "bg-foreground/5 text-foreground/70 border-foreground/10 hover:bg-foreground/10 border"
            )}
          >
            {p === "month" ? "Monthly" : "Weekly"}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="flex h-[300px] w-full flex-row">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(254,254,254,0.08)"
            />
            <XAxis
              dataKey="period"
              tick={{ fill: "rgba(254,254,254,0.5)", fontSize: 12 }}
              angle={chartData.length > 5 ? -45 : 0}
              textAnchor={chartData.length > 5 ? "end" : "middle"}
              height={chartData.length > 5 ? 80 : 30}
            />
            <YAxis tick={{ fill: "rgba(254,254,254,0.5)", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid rgba(254,254,254,0.12)",
                borderRadius: "12px",
                color: "#fefefe",
              }}
              cursor={{ fill: "rgba(99, 102, 241, 0.1)" }}
              formatter={(value) => {
                if (typeof value === "number") {
                  return [`${value}`, "Recent unfollows"];
                }
                return value;
              }}
            />
            <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Total */}
        <div className="bg-foreground/5 flex flex-col items-center rounded-lg p-4">
          <p className="text-foreground/60 text-xs font-semibold tracking-widest uppercase">
            Recent unfollowers
          </p>
          <p className="text-foreground mt-2 text-2xl font-bold">
            {patternResult.totalUnfollowers}
          </p>
        </div>

        {/* Peak period */}
        {patternResult.peakPeriod && (
          <div className="bg-accent/10 rounded-lg p-4">
            <p className="text-accent/80 text-xs font-semibold tracking-widest uppercase">
              Peak period
            </p>
            <p className="text-accent mt-2 text-sm font-semibold">
              {patternResult.peakPeriod.period}
            </p>
            <p className="text-accent/70 text-xs">
              {patternResult.peakPeriod.count} recent unfollows
            </p>
          </div>
        )}

        {/* Average per period */}
        <div className="bg-foreground/5 rounded-lg p-4">
          <p className="text-foreground/60 text-xs font-semibold tracking-widest uppercase">
            Avg per period
          </p>
          <p className="text-foreground mt-2 text-2xl font-bold">
            {Math.round(patternResult.averagePerPeriod)}
          </p>
        </div>

        {/* Trend */}
        <div className="bg-foreground/5 flex flex-col items-center rounded-lg p-4">
          <p className="text-foreground/60 text-xs font-semibold tracking-widest uppercase">
            Trend
          </p>
          <div className="mt-4">
            <TrendIcon trend={patternResult.trend} />
          </div>
        </div>
      </div>

      {/* Interpretation */}
      <div className="border-foreground/10 bg-foreground/5 mt-6 flex flex-row rounded-lg border p-4">
        <p className="text-foreground text-sm leading-6">
          {patternResult.trend === "increasing" && (
            <>
              <strong>📈 Watch out!</strong> Your unfollower rate is increasing.
              You're losing followers at an accelerating pace. Consider
              reviewing your recent content or engagement strategy.
            </>
          )}
          {patternResult.trend === "decreasing" && (
            <>
              <strong>✨ Looking good!</strong> Your unfollower rate is
              decreasing, which suggests your recent content and engagement
              strategy are working well.
            </>
          )}
          {patternResult.trend === "stable" && (
            <>
              <strong>⚖️ Balanced.</strong> Your unfollower rate is stable over
              time. Keep maintaining your current strategy while monitoring key
              periods.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
