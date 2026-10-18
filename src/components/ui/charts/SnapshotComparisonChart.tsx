import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ComparisonChartDatum } from "@/features/relationship/services/analysisComparisonService";
import { ChartCard } from "./ChartCard";
import { chartTheme } from "./chartTheme";

type SnapshotComparisonChartProps = {
  data: ComparisonChartDatum[];
  olderLabel: string;
  newerLabel: string;
};

// Grouped bars (older vs newer per category) - no Recharts Legend, an HTML
// list instead, same style choice as ResultPieChart/RecentUnfollowActivityChart.
export function SnapshotComparisonChart({
  data,
  olderLabel,
  newerLabel,
}: SnapshotComparisonChartProps) {
  return (
    <ChartCard
      title="Totals over time"
      description="How your follower, following and mutual counts changed between the two snapshots."
    >
      <div className="h-[220px] w-full min-w-0 sm:h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: -16, right: 4 }}>
            <CartesianGrid vertical={false} stroke={chartTheme.grid} />
            <XAxis
              dataKey="category"
              tick={{ fill: chartTheme.axis, fontSize: 11 }}
              tickLine={false}
              axisLine={false}
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
            />
            <Bar
              dataKey="older"
              name={olderLabel}
              fill={chartTheme.barMuted}
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />
            <Bar
              dataKey="newer"
              name={newerLabel}
              fill={chartTheme.series[0]}
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <ul className="flex items-center gap-4 text-[13px]">
        <li className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="size-2 shrink-0 rounded-[2px]"
            style={{ backgroundColor: chartTheme.barMuted }}
          />
          <span className="text-fg-muted">{olderLabel}</span>
        </li>
        <li className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="size-2 shrink-0 rounded-[2px]"
            style={{ backgroundColor: chartTheme.series[0] }}
          />
          <span className="text-fg-muted">{newerLabel}</span>
        </li>
      </ul>
    </ChartCard>
  );
}
