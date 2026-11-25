// Colors for SVG and chart props (Recharts, inline SVG). They point at the
// theme's CSS variables, so charts follow light and dark like everything
// else: browsers resolve var() in SVG presentation attributes and inline
// styles. Code that has to interpolate a color itself (GSAP tweens) reads
// the current value with `readThemeColor`.
export const chartTheme = {
  // data-1…5: the data palette, in order
  series: [
    "var(--color-data-1)",
    "var(--color-data-2)",
    "var(--color-data-3)",
    "var(--color-data-4)",
    "var(--color-data-5)",
  ],
  surface1: "var(--color-surface-1)",
  brand: "var(--color-brand)", // fills and glows drawn in SVG
  barMuted: "var(--color-data-5)", // chart fills only
  barHighlight: "var(--color-danger)",
  grid: "var(--color-line-subtle)",
  axis: "var(--color-fg-faint)",
  cursor: "var(--color-line-subtle)",
  tooltip: {
    contentStyle: {
      backgroundColor: "var(--color-surface-2)",
      border: "1px solid var(--color-line-strong)",
      borderRadius: "12px",
      boxShadow: "var(--shadow-elev-2)",
      color: "var(--color-fg)",
      fontSize: "13px",
    },
    labelStyle: { color: "var(--color-fg-muted)" },
    itemStyle: { color: "var(--color-fg)" },
  },
} as const;

/** The current value of a `var(--…)` color, for code that interpolates it. */
export function readThemeColor(value: string) {
  const name = /^var\((--[\w-]+)\)$/.exec(value)?.[1];
  if (!name || typeof window === "undefined") return value;
  return (
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
    value
  );
}
