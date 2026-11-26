import clsx from "clsx";

type OrbitsProps = {
  /** Width and height in px. */
  size: number;
  /** Dot size multiplier: smaller for big decorative uses. */
  dotScale?: number;
  /** Turn forever. Off on phones and where the orbits must stay still. */
  spinning?: boolean;
  className?: string;
};

// Three rings in the relationship group colors (inner Mutual, middle Don't
// follow you back, outer You don't follow back), the motif of the analysis
// loading screen. Each ring turns at its own speed, alternating direction.
// Decorative only; "Reduce motion" stops them (index.css).
const RINGS = [
  {
    radius: 22,
    dots: 6,
    dotClass: "fill-data-1",
    duration: 46,
    reverse: false,
  },
  { radius: 34, dots: 9, dotClass: "fill-data-3", duration: 70, reverse: true },
  {
    radius: 46,
    dots: 12,
    dotClass: "fill-data-2",
    duration: 96,
    reverse: false,
  },
] as const;

export function Orbits({
  size,
  dotScale = 1,
  spinning = true,
  className,
}: OrbitsProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden="true"
      focusable="false"
      overflow="visible"
      className={clsx("pointer-events-none", className)}
    >
      {RINGS.map((ring, ringIndex) => (
        <g
          key={ring.radius}
          className={clsx(spinning && "orbit-spin")}
          style={
            spinning
              ? {
                  animationDuration: `${ring.duration}s`,
                  animationDirection: ring.reverse ? "reverse" : "normal",
                }
              : undefined
          }
        >
          <circle
            cx={50}
            cy={50}
            r={ring.radius}
            fill="none"
            strokeWidth={0.28}
            className="stroke-line-strong"
          />
          {Array.from({ length: ring.dots }, (_, dotIndex) => {
            const angle =
              (dotIndex / ring.dots) * Math.PI * 2 + ringIndex * 0.7;
            return (
              <circle
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed dot positions
                key={dotIndex}
                cx={50 + ring.radius * Math.cos(angle)}
                cy={50 + ring.radius * Math.sin(angle)}
                r={(1.25 - ringIndex * 0.18) * dotScale}
                className={ring.dotClass}
              />
            );
          })}
        </g>
      ))}
    </svg>
  );
}
