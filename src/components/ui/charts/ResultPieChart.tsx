import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartCard } from "./ChartCard";
import { chartTheme } from "./chartTheme";

export type PieChartDatum = {
  name: string;
  value: number;
};

type ResultsPieChartProps = {
  data: PieChartDatum[];
  title?: string;
};

const CHART_COLORS = chartTheme.series;

function buildCompactChartData(data: PieChartDatum[]): PieChartDatum[] {
  const filtered = data
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);

  const topItems = filtered.slice(0, 4);
  const restItems = filtered.slice(4);

  const otherValue = restItems.reduce((sum, item) => sum + item.value, 0);

  if (otherValue > 0) {
    topItems.push({
      name: "Other",
      value: otherValue,
    });
  }

  return topItems;
}

export function ResultsPieChart({
  data,
  title = "Results overview",
}: ResultsPieChartProps) {
  const chartData = buildCompactChartData(data);
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  if (chartData.length === 0) {
    return null;
  }

  return (
    <ChartCard
      title={title}
      description="A quick overview of your relationship groups."
    >
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
        <div className="relative size-[200px] shrink-0 sm:size-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius="70%"
                outerRadius="92%"
                paddingAngle={1}
                stroke={chartTheme.surface1}
                strokeWidth={2}
                label={false}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={chartTheme.tooltip.contentStyle}
                labelStyle={chartTheme.tooltip.labelStyle}
                itemStyle={chartTheme.tooltip.itemStyle}
                formatter={(value, name) => {
                  const numericValue = typeof value === "number" ? value : 0;
                  const label = typeof name === "string" ? name : "";

                  const percentage = total
                    ? ((numericValue / total) * 100).toFixed(0)
                    : "0";

                  return [`${numericValue} (${percentage}%)`, label];
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-fg text-2xl leading-none font-semibold tracking-[-0.03em] tabular-nums">
                {total}
              </p>
              <p className="text-fg-muted mt-1 text-xs">Total</p>
            </div>
          </div>
        </div>

        <ul className="flex w-full min-w-0 flex-col gap-2.5">
          {chartData.map((item, index) => {
            const percentage = total
              ? Math.round((item.value / total) * 100)
              : 0;

            return (
              <li
                key={item.name}
                className="flex min-w-0 items-center gap-2.5 text-[13px]"
              >
                <span
                  aria-hidden="true"
                  className="size-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                  }}
                />
                <span className="text-fg-muted min-w-0 flex-1 truncate">
                  {item.name}
                </span>
                <span className="text-fg font-medium tabular-nums">
                  {item.value}
                </span>
                <span className="text-fg-faint w-9 text-end tabular-nums">
                  {percentage}%
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </ChartCard>
  );
}
