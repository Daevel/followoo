import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export type PieChartDatum = {
  name: string;
  value: number;
};

type ResultsPieChartProps = {
  data: PieChartDatum[];
  title?: string;
};

const CHART_COLORS = [
  "#6366f1",
  "#f43f5e",
  "rgba(99, 102, 241, 0.75)",
  "rgba(244, 63, 94, 0.75)",
  "rgba(254, 254, 254, 0.22)",
];

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
    <div className="border-foreground/10 w-full rounded-3xl border bg-white/5 p-5 md:p-6">
      <div className="mb-5 text-start">
        <h3 className="text-foreground text-xl font-semibold">{title}</h3>
        <p className="text-foreground/70 mt-1 text-sm">
          A quick overview of your relationship groups.
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
        <div className="relative h-[260px] w-full lg:h-[320px] lg:flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius="58%"
                outerRadius="82%"
                stroke="rgba(254,254,254,0.16)"
                strokeWidth={1}
                label={false}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`${entry.name}-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid rgba(254,254,254,0.12)",
                  borderRadius: "16px",
                  color: "#fefefe",
                }}
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
              <p className="text-foreground/60 text-xs tracking-wide uppercase">
                Total
              </p>
              <p className="text-foreground text-3xl font-semibold">{total}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:w-[320px]">
          {chartData.map((item, index) => {
            const percentage = total
              ? Math.round((item.value / total) * 100)
              : 0;

            return (
              <div
                key={item.name}
                className="border-foreground/10 bg-foreground/5 flex items-center justify-between rounded-2xl border px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{
                      backgroundColor:
                        CHART_COLORS[index % CHART_COLORS.length],
                    }}
                  />
                  <span className="text-foreground text-sm font-medium">
                    {item.name}
                  </span>
                </div>

                <div className="text-end">
                  <p className="text-foreground text-sm font-semibold">
                    {item.value}
                  </p>
                  <p className="text-foreground/60 text-xs">{percentage}%</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
