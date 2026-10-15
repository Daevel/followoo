import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Icon, type IconName } from "@/components/ui/Icon";
import { TabButton } from "@/components/ui/TabButton";
import {
  calculateRecentUnfollowActivity,
  type RecentUnfollowActivityPeriod,
  type RecentUnfollowActivityResult,
} from "@/features/relationship/services/recentUnfollowActivityService";
import type { InstagramUser } from "@/types/instagram.types";
import { ChartCard, ChartStats } from "./ChartCard";
import { chartTheme } from "./chartTheme";

type RecentUnfollowActivityChartProps = {
  recentUnfollowers: InstagramUser[];
};

// Trend as icon + word; more unfollows is the bad direction.
const trendStyles: Record<
  "increasing" | "decreasing" | "stable",
  { label: string; icon: IconName; tone: BadgeTone }
> = {
  increasing: { label: "Increasing", icon: "singleArrowUp", tone: "danger" },
  decreasing: { label: "Decreasing", icon: "singleArrowDown", tone: "success" },
  stable: { label: "Stable", icon: "check", tone: "neutral" },
};

function TrendBadge({
  trend,
}: {
  trend: "increasing" | "decreasing" | "stable";
}) {
  const { label, icon, tone } = trendStyles[trend];

  return (
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
  );
}

export function RecentUnfollowActivityChart({
  recentUnfollowers,
}: RecentUnfollowActivityChartProps) {
  const [period, setPeriod] = useState<RecentUnfollowActivityPeriod>("month");

  const activityResult: RecentUnfollowActivityResult = useMemo(
    () => calculateRecentUnfollowActivity(recentUnfollowers, period),
    [recentUnfollowers, period]
  );

  type ChartDataPoint = {
    period: string;
    count: number;
    percentage: number;
  };

  const chartData: ChartDataPoint[] = activityResult.data.map((point) => ({
    period: point.period,
    count: point.count,
    percentage: parseFloat(point.percentage.toFixed(1)),
  }));

  const peakPeriod = activityResult.peakPeriod?.period;

  return (
    <ChartCard
      title="Recent unfollow activity"
      description="Based only on recent unfollowers included in this Instagram export."
      action={
        <div
          role="tablist"
          aria-label="Group by"
          className="border-line-subtle bg-surface-1 inline-flex gap-0.5 rounded-xl border p-[3px]"
        >
          {(["month", "week"] as const).map((p) => (
            <TabButton
              key={p}
              active={period === p}
              onClick={() => setPeriod(p)}
            >
              {p === "month" ? "Monthly" : "Weekly"}
            </TabButton>
          ))}
        </div>
      }
    >
      <div className="h-[220px] w-full min-w-0 sm:h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ left: -16, right: 4 }}>
            <CartesianGrid vertical={false} stroke={chartTheme.grid} />
            <XAxis
              dataKey="period"
              tick={{ fill: chartTheme.axis, fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              angle={chartData.length > 5 ? -45 : 0}
              textAnchor={chartData.length > 5 ? "end" : "middle"}
              height={chartData.length > 5 ? 70 : 24}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: chartTheme.axis, fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={chartTheme.tooltip.contentStyle}
              labelStyle={chartTheme.tooltip.labelStyle}
              itemStyle={chartTheme.tooltip.itemStyle}
              cursor={{ fill: chartTheme.cursor }}
              formatter={(value) => {
                if (typeof value === "number") {
                  return [`${value}`, "Recent unfollows"];
                }
                return value;
              }}
            />
            {/* neutral bars; only the peak period carries color */}
            <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={28}>
              {chartData.map((point) => (
                <Cell
                  key={point.period}
                  fill={
                    point.period === peakPeriod
                      ? chartTheme.barHighlight
                      : chartTheme.barMuted
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <ChartStats
        stats={[
          {
            label: "Recent unfollowers",
            value: activityResult.totalUnfollowers,
          },
          {
            label: "Peak period",
            value: activityResult.peakPeriod?.period ?? "—",
            detail: activityResult.peakPeriod
              ? `${activityResult.peakPeriod.count} recent unfollows`
              : undefined,
          },
          {
            label: "Avg per period",
            value: Math.round(activityResult.averagePerPeriod),
          },
          {
            label: "Trend",
            value: <TrendBadge trend={activityResult.trend} />,
          },
        ]}
      />

      <p className="text-fg-muted text-[13px] leading-[1.6]">
        {activityResult.trend === "increasing" && (
          <>
            <strong className="text-fg font-medium">
              Recent unfollows increased.
            </strong>{" "}
            Instagram reports more recent unfollow records in the later periods
            of this export.
          </>
        )}
        {activityResult.trend === "decreasing" && (
          <>
            <strong className="text-fg font-medium">
              Recent unfollows decreased.
            </strong>{" "}
            Instagram reports fewer recent unfollow records in the later periods
            of this export.
          </>
        )}
        {activityResult.trend === "stable" && (
          <>
            <strong className="text-fg font-medium">
              Recent unfollows look stable.
            </strong>{" "}
            The records in this export do not show a strong increase or decrease
            over the grouped periods.
          </>
        )}
      </p>
    </ChartCard>
  );
}
