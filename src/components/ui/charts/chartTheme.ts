// Recharts takes colors as SVG props, where CSS variables are not reliable,
// so these mirror the semantic tokens in src/index.css: keep them in sync.
export const chartTheme = {
  // data-1…5: same order and meaning as the persona/data palette
  series: ["#818cf8", "#22d3ee", "#fbbf24", "#c084fc", "#6b7194"],
  surface1: "#12152a",
  barMuted: "#6b7194", // data-5: chart fills only
  barHighlight: "#fb7185", // danger
  grid: "rgba(255, 255, 255, 0.06)", // line-subtle
  axis: "#6b7194", // fg-faint
  cursor: "rgba(255, 255, 255, 0.04)",
  tooltip: {
    contentStyle: {
      backgroundColor: "#1a1e38", // surface-2
      border: "1px solid rgba(255, 255, 255, 0.12)", // line-strong
      borderRadius: "12px",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.45)", // elev-2
      color: "#f5f6fb", // fg
      fontSize: "13px",
    },
    labelStyle: { color: "#9aa0bd" }, // fg-muted
    itemStyle: { color: "#f5f6fb" },
  },
} as const;
