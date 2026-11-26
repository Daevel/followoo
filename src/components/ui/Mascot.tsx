import clsx from "clsx";
import { type ReactNode, useId } from "react";
import { LOGO_BODY } from "./logoShape";

export type MascotPose =
  | "wave"
  | "happy"
  | "think"
  | "cheer"
  | "curious"
  | "search"
  | "party"
  | "sleep"
  | "oops";

type MascotProps = {
  pose?: MascotPose;
  /** Width and height in px. */
  size?: number;
  /** Floating, blinking and waving. Off for static uses. */
  animated?: boolean;
  className?: string;
  /** Position when nested inside another SVG. */
  x?: number;
  y?: number;
};

// The mascot is a brand illustration, so its colors are fixed and the same
// in both themes, like the logo (#6366F1).
const C = {
  top: "#818cf8",
  body: "#6366f1",
  edge: "#4f46e5",
  arm: "#7c83f7",
  ink: "#0b0d17",
  white: "#ffffff",
  blush: "#f9a8d4",
  amber: "#fbbf24",
  cyan: "#22d3ee",
  lilac: "#a5b4fc",
  tongue: "#fb7185",
} as const;

// Eye centers match the logo's eyes (logoShape.ts).
const L = { x: 41, y: 50 };
const R = { x: 69, y: 50 };
type Point = typeof L;

function Pill({
  at,
  h = 18,
  dx = 0,
  dy = 0,
}: {
  at: Point;
  h?: number;
  dx?: number;
  dy?: number;
}) {
  return (
    <>
      <rect
        x={at.x - 5 + dx}
        y={at.y - h / 2 + dy}
        width={10}
        height={h}
        rx={5}
        fill={C.ink}
      />
      <circle
        cx={at.x - 1.5 + dx}
        cy={at.y - h / 2 + 4.5 + dy}
        r={2}
        fill={C.white}
      />
    </>
  );
}

function ArcEye({ at, up = true }: { at: Point; up?: boolean }) {
  const y1 = at.y + (up ? 3 : -2);
  const cy = at.y + (up ? -6 : 6);
  return (
    <path
      d={`M${at.x - 6} ${y1} Q${at.x} ${cy} ${at.x + 6} ${y1}`}
      stroke={C.ink}
      strokeWidth={4.2}
      fill="none"
      strokeLinecap="round"
    />
  );
}

function Blush() {
  return (
    <>
      <ellipse
        cx={L.x - 8}
        cy={66}
        rx={6}
        ry={3.5}
        fill={C.blush}
        opacity={0.55}
      />
      <ellipse
        cx={R.x + 8}
        cy={66}
        rx={6}
        ry={3.5}
        fill={C.blush}
        opacity={0.55}
      />
    </>
  );
}

function Smile({ w = 12, d = 7 }: { w?: number; d?: number }) {
  return (
    <path
      d={`M${55 - w / 2} 66 Q55 ${66 + d} ${55 + w / 2} 66`}
      stroke={C.ink}
      strokeWidth={4}
      fill="none"
      strokeLinecap="round"
    />
  );
}

// A small rounded stub that starts inside the body and points out.
function Arm({
  side,
  rot,
  y,
}: {
  side: "left" | "right";
  rot: number;
  y: number;
}) {
  const x = side === "left" ? 20 : 94;
  return (
    <g transform={`rotate(${rot} ${x} ${y})`}>
      <rect
        x={x - 6}
        y={y - 22}
        width={12}
        height={24}
        rx={6}
        fill={C.arm}
        stroke={C.edge}
        strokeWidth={2}
      />
    </g>
  );
}

function Eyes({ children }: { children: ReactNode }) {
  return <g className="mascot-eyes">{children}</g>;
}

const faces: Record<MascotPose, () => ReactNode> = {
  wave: () => (
    <>
      <Eyes>
        <Pill at={L} />
        <Pill at={R} />
      </Eyes>
      <Blush />
      <Smile w={14} d={8} />
      <g className="mascot-wave">
        <Arm side="left" rot={-35} y={58} />
      </g>
    </>
  ),
  happy: () => (
    <>
      <Eyes>
        <Pill at={L} />
        <Pill at={R} />
      </Eyes>
      <Blush />
      <Smile />
    </>
  ),
  think: () => (
    <>
      <Eyes>
        <Pill at={L} h={16} dx={2} dy={-4} />
        <Pill at={R} h={16} dx={2} dy={-4} />
      </Eyes>
      <Smile w={8} d={3} />
      <g fill={C.lilac} className="mascot-float">
        <circle cx={92} cy={22} r={3} />
        <circle cx={101} cy={12} r={4.2} />
        <circle cx={112} cy={2} r={5.4} />
      </g>
    </>
  ),
  cheer: () => (
    <>
      <Eyes>
        <Pill at={L} dy={-2} />
        <Pill at={R} dy={-2} />
      </Eyes>
      <Blush />
      <Smile w={16} d={9} />
      <Arm side="left" rot={-30} y={58} />
      <Arm side="right" rot={30} y={60} />
    </>
  ),
  curious: () => (
    <>
      <Eyes>
        <Pill at={L} h={16} dx={2} dy={1} />
        <Pill at={R} h={20} dx={2} dy={-1} />
      </Eyes>
      <ellipse cx={55} cy={68} rx={3.6} ry={4.2} fill={C.ink} />
    </>
  ),
  search: () => (
    <>
      <Eyes>
        <Pill at={L} h={16} dx={4} dy={3} />
        <Pill at={R} h={16} dx={4} dy={3} />
      </Eyes>
      <ellipse cx={55} cy={68} rx={3.6} ry={4.2} fill={C.ink} />
      <g transform="translate(84 58)">
        <path
          d="M19 17 L30 29"
          stroke="#f59e0b"
          strokeWidth={6}
          strokeLinecap="round"
        />
        <circle
          cx={11}
          cy={9}
          r={11}
          fill="#e0f2fe"
          fillOpacity={0.55}
          stroke="#e0e7ff"
          strokeWidth={4}
        />
      </g>
      <Arm side="right" rot={-200} y={80} />
    </>
  ),
  party: () => (
    <>
      <ArcEye at={L} />
      <ArcEye at={R} />
      <Blush />
      <path d="M47 65 Q55 79 63 65 Z" fill={C.ink} />
      <path d="M51 71 Q55 75 59 71" fill={C.tongue} />
      <Arm side="left" rot={-45} y={56} />
      <Arm side="right" rot={45} y={58} />
      <g className="mascot-float">
        <rect
          x={8}
          y={14}
          width={6}
          height={3}
          rx={1.5}
          fill={C.amber}
          transform="rotate(30 11 15)"
        />
        <rect
          x={100}
          y={10}
          width={6}
          height={3}
          rx={1.5}
          fill={C.cyan}
          transform="rotate(-25 103 11)"
        />
        <circle cx={24} cy={4} r={2.4} fill={C.lilac} />
        <circle cx={92} cy={28} r={2.2} fill={C.amber} />
        <rect
          x={58}
          y={-2}
          width={6}
          height={3}
          rx={1.5}
          fill={C.blush}
          transform="rotate(60 61 0)"
        />
        <circle cx={110} cy={40} r={2} fill={C.cyan} />
      </g>
    </>
  ),
  sleep: () => (
    <>
      <ArcEye at={L} up={false} />
      <ArcEye at={R} up={false} />
      <Blush />
      <Smile w={8} d={3} />
      <g
        fill={C.lilac}
        className="mascot-float"
        fontFamily="Inter, sans-serif"
        fontWeight={800}
      >
        <text x={88} y={22} fontSize={16}>
          z
        </text>
        <text x={100} y={10} fontSize={11}>
          z
        </text>
      </g>
    </>
  ),
  oops: () => (
    <>
      <Eyes>
        <Pill at={L} />
        <Pill at={R} h={12} dy={2} />
      </Eyes>
      <path
        d="M46 69 q3 -4 6 0 t6 0 t6 0"
        stroke={C.ink}
        strokeWidth={3.6}
        fill="none"
        strokeLinecap="round"
      />
      <Arm side="left" rot={-20} y={60} />
      <text
        x={94}
        y={26}
        fontFamily="Inter, sans-serif"
        fontSize={24}
        fontWeight={800}
        fill={C.amber}
      >
        ?
      </text>
    </>
  ),
};

// Followoo's mascot: the logo ghost with a face. One pose per moment (see
// the project-scaffolding skill); never sad, so a low score never reads as
// mockery. Decorative: always aria-hidden, the text next to it carries the
// meaning. "Reduce motion" stops the floating and blinking (index.css).
export function Mascot({
  pose = "happy",
  size = 96,
  animated = true,
  className,
  x,
  y,
}: MascotProps) {
  const gradientId = useId();

  return (
    <svg
      width={size}
      height={size}
      x={x}
      y={y}
      viewBox="-6 -10 132 136"
      aria-hidden="true"
      focusable="false"
      overflow="visible"
      className={clsx("shrink-0", animated && "mascot-animated", className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.top} />
          <stop offset="1" stopColor={C.body} />
        </linearGradient>
      </defs>
      <ellipse
        className="mascot-shadow"
        cx={62}
        cy={122}
        rx={30}
        ry={4}
        fill="#000"
        opacity={0.18}
      />
      <g className="mascot-body">
        <path d={LOGO_BODY} fill={`url(#${gradientId})`} />
        <path
          d="M30 30 Q38 16 52 14"
          stroke={C.white}
          strokeOpacity={0.35}
          strokeWidth={4}
          fill="none"
          strokeLinecap="round"
        />
        {faces[pose]()}
      </g>
    </svg>
  );
}
