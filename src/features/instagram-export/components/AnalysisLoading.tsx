import clsx from "clsx";
import { forwardRef, useEffect, useId, useMemo, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { chartTheme } from "@/components/ui/charts/chartTheme";
import { Icon } from "@/components/ui/Icon";
import {
  LOGO_BODY,
  LOGO_CENTER,
  LOGO_EYES,
  LOGO_MOUTH,
} from "@/components/ui/logoShape";
import {
  RELATIONSHIP_GROUPS,
  type RelationshipGroupCounts,
} from "@/features/relationship/constants/relationshipGroups";
import { useAnalysisNetworkAnimation } from "../animations/useAnalysisNetworkAnimation";
import {
  buildConstellation,
  NETWORK_VIEWBOX,
  ORBIT_RADII,
  ORBIT_SCALE,
  peoplePerDot,
} from "../utils/analysisNetwork";

type AnalysisLoadingProps = {
  /** Group counts from the finished analysis; null while it is running. */
  counts: RelationshipGroupCounts | null;
  /**
   * Profile photo of the signed-in Followoo account (from Clerk, never from
   * Instagram). Without one, the Followoo ghost sits at the center.
   */
  avatarUrl?: string | null;
};

/** Background rings that carry the orbits out to the edges of the screen. */
const FIELD_RADII = [150, 210, 280, 360, 450];

const STEPS = [
  { from: 0, label: "Reading ZIP file" },
  { from: 18, label: "Extracting JSON files" },
  { from: 40, label: "Analyzing followers" },
  { from: 62, label: "Comparing relationships" },
  { from: 85, label: "Preparing results" },
];

/** Time the progress takes to reach 90%, matching the minimum loading time. */
const EXPECTED_MS = 2200;
/** The dots sort themselves into orbits from this progress on. */
const SETTLE_AT = 56;

function readMedia(query: string) {
  return typeof window !== "undefined" && window.matchMedia(query).matches;
}

// Loading screen shown while the export is analyzed on the device. The
// network around the user's avatar (or the Followoo ghost) is a picture of
// shares, not people: dots take the real proportions of the three
// relationship groups, with the same labels and colors as the results page.
// Its orbits continue into the background as a faint field of rings.
export const AnalysisLoading = forwardRef<HTMLDivElement, AnalysisLoadingProps>(
  function AnalysisLoading({ counts, avatarUrl = null }, ref) {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const idPrefix = useId();
    const [hasAvatarError, setHasAvatarError] = useState(false);
    const showAvatar = Boolean(avatarUrl) && !hasAvatarError;
    const [media] = useState(() => ({
      isWide: readMedia("(min-width: 1024px)"),
      reduceMotion: readMedia("(prefers-reduced-motion: reduce)"),
    }));
    const dots = useMemo(
      () => buildConstellation(media.isWide ? 36 : 24),
      [media.isWide]
    );
    const progress = useSimulatedProgress(counts !== null);

    const isDone = progress >= 100;
    const shouldSettle = counts !== null && progress >= SETTLE_AT;

    useAnalysisNetworkAnimation({
      scopeRef: svgRef,
      counts,
      shouldSettle,
      isWide: media.isWide,
      reduceMotion: media.reduceMotion,
    });

    const label = isDone
      ? "Done"
      : [...STEPS].reverse().find((step) => progress >= step.from)?.label;
    const total = counts
      ? RELATIONSHIP_GROUPS.reduce((sum, group) => sum + counts[group.key], 0)
      : 0;
    const perDot = peoplePerDot(total, dots.length);

    return (
      <div
        ref={ref}
        data-loading-root
        className="relative min-h-svh overflow-hidden"
      >
        <img
          src="/favicon.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-6 bottom-6 size-[22px] opacity-40 lg:right-10 lg:bottom-8 lg:size-7"
        />
        <Container size="app" className="flex min-h-svh flex-col">
          <div className="relative flex flex-1 flex-col items-center justify-center gap-9 py-16 text-center lg:flex-row lg:gap-[72px] lg:text-start">
            <svg
              ref={svgRef}
              data-loading-img
              viewBox={NETWORK_VIEWBOX}
              aria-hidden="true"
              className="w-[220px] shrink-0 overflow-visible lg:w-[300px]"
            >
              <defs>
                <radialGradient id={`${idPrefix}-glow`}>
                  <stop
                    offset="0"
                    stopColor={chartTheme.brand}
                    stopOpacity={0.16}
                  />
                  <stop
                    offset="1"
                    stopColor={chartTheme.brand}
                    stopOpacity={0}
                  />
                </radialGradient>
                <clipPath id={`${idPrefix}-avatar`}>
                  <circle r={21} />
                </clipPath>
              </defs>

              <g data-network-field>
                <ellipse rx={330} ry={250} fill={`url(#${idPrefix}-glow)`} />
                {FIELD_RADII.map((radius, index) => (
                  <ellipse
                    key={radius}
                    data-network-field-ring
                    rx={radius * ORBIT_SCALE.x}
                    ry={radius * ORBIT_SCALE.y}
                    fill="none"
                    className="stroke-brand-fg"
                    strokeOpacity={Math.max(0.02, 0.07 - index * 0.012)}
                    opacity={0}
                  />
                ))}
              </g>

              {RELATIONSHIP_GROUPS.map((group) => (
                <ellipse
                  key={group.key}
                  data-network-orbit
                  rx={ORBIT_RADII[group.key] * ORBIT_SCALE.x}
                  ry={ORBIT_RADII[group.key] * ORBIT_SCALE.y}
                  fill="none"
                  strokeDasharray="2 5"
                  className="stroke-line-strong"
                  opacity={0}
                />
              ))}

              <g data-network-rotor>
                {dots.map((dot, index) => (
                  <line
                    // biome-ignore lint/suspicious/noArrayIndexKey: fixed, ordered geometry
                    key={`line-${index}`}
                    data-network-line
                    x1={0}
                    y1={0}
                    x2={dot.x}
                    y2={dot.y}
                    strokeWidth={0.8}
                    className="stroke-fg-faint"
                    opacity={0}
                  />
                ))}
                {dots.map((dot, index) => (
                  <circle
                    // biome-ignore lint/suspicious/noArrayIndexKey: fixed, ordered geometry
                    key={`dot-${index}`}
                    data-network-dot
                    cx={dot.x}
                    cy={dot.y}
                    r={dot.radius}
                    fill={chartTheme.barMuted}
                    opacity={0}
                  />
                ))}
              </g>

              {showAvatar && avatarUrl ? (
                <g data-network-avatar>
                  <circle
                    r={24}
                    strokeWidth={2}
                    className="fill-surface-0 stroke-brand"
                  />
                  <image
                    href={avatarUrl}
                    x={-21}
                    y={-21}
                    width={42}
                    height={42}
                    preserveAspectRatio="xMidYMid slice"
                    clipPath={`url(#${idPrefix}-avatar)`}
                    onError={() => setHasAvatarError(true)}
                  />
                </g>
              ) : (
                <g data-network-ghost>
                  <circle r={20} className="fill-brand" />
                  <g
                    transform={`scale(0.27) translate(${-LOGO_CENTER} ${-LOGO_CENTER})`}
                  >
                    <path d={LOGO_BODY} className="fill-on-brand" />
                    <g data-network-eyes className="fill-brand">
                      {LOGO_EYES.map((eye) => (
                        <rect key={eye.x} {...eye} />
                      ))}
                    </g>
                    <rect {...LOGO_MOUTH} className="fill-brand" />
                  </g>
                </g>
              )}
            </svg>

            <div className="w-full max-w-[300px]">
              <p className="text-fg-muted mb-2.5 hidden items-center gap-1.5 text-xs font-medium lg:flex">
                Analysis in progress ·
                <span className="text-success inline-flex items-center gap-1">
                  <Icon
                    name="lock"
                    color="current"
                    width={12}
                    height={12}
                    aria-hidden="true"
                  />
                  Only in your browser
                </span>
              </p>

              <div className="flex items-baseline justify-center gap-2.5 lg:justify-between">
                <h2
                  data-loading-title
                  className="text-fg text-base font-semibold tracking-[-0.02em] lg:text-lg"
                >
                  Analyzing your data
                </h2>
                <span
                  data-loading-progress
                  className="text-fg text-base font-semibold tabular-nums lg:text-lg"
                >
                  {progress}%
                </span>
              </div>

              <div data-loading-bar-wrapper className="mt-3">
                <div
                  role="progressbar"
                  aria-label="Analysis progress"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={progress}
                  className="bg-surface-2 h-1 w-full overflow-hidden rounded-full"
                >
                  <div
                    data-loading-bar-fill
                    className="bg-brand-fg h-full rounded-full transition-[width] duration-200 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <p
                data-loading-label
                aria-live="polite"
                className="text-fg-muted mt-3 flex items-center justify-center gap-2 text-[13px] lg:justify-start"
              >
                {isDone ? (
                  <Icon
                    name="check"
                    color="current"
                    width={14}
                    height={14}
                    className="text-success"
                    aria-hidden="true"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="border-surface-2 border-t-brand-fg size-3 shrink-0 animate-spin rounded-full border-[1.5px] motion-reduce:animate-none"
                  />
                )}
                {label}
              </p>

              {/* Space is reserved from the start, so nothing jumps when the
                  real counts appear. */}
              <div
                aria-hidden={!shouldSettle}
                className={clsx(
                  "mt-7 transition-opacity delay-300 duration-500 motion-reduce:transition-none",
                  shouldSettle ? "opacity-100" : "opacity-0"
                )}
              >
                {/* One row per group, so long group names never overflow. */}
                <dl className="mx-auto flex max-w-[260px] flex-col gap-1.5 text-start lg:mx-0 lg:max-w-none">
                  {RELATIONSHIP_GROUPS.map((group) => (
                    <div
                      key={group.key}
                      className="flex items-baseline justify-between gap-4"
                    >
                      <dt className="text-fg-muted flex items-center gap-2 text-[12.5px]">
                        <span
                          aria-hidden="true"
                          className={clsx(
                            "size-[7px] rounded-full",
                            group.dotClass
                          )}
                        />
                        {group.label}
                      </dt>
                      <dd className="text-fg text-[15px] font-semibold tracking-[-0.01em] tabular-nums">
                        {counts ? counts[group.key] : 0}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="text-fg-faint mt-2.5 min-h-4 text-center text-[11px] lg:text-start">
                  {perDot !== null && `Each dot is about ${perDot} people`}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }
);

// Progress follows the expected duration up to 90%, then waits for the
// analysis: it only reaches 100% once the real counts are in.
function useSimulatedProgress(hasResult: boolean) {
  const [progress, setProgress] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current ??= performance.now();
    const start = startRef.current;

    const interval = window.setInterval(() => {
      const elapsed = performance.now() - start;
      const next =
        hasResult && elapsed >= EXPECTED_MS
          ? 100
          : Math.min(90, Math.round((elapsed / EXPECTED_MS) * 90));
      setProgress((previous) => Math.max(previous, next));
      if (next === 100) window.clearInterval(interval);
    }, 100);

    return () => window.clearInterval(interval);
  }, [hasResult]);

  return progress;
}
