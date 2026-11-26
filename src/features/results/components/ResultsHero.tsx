import type { CSSProperties } from "react";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Orbits } from "@/components/ui/Orbits";
import type {
  FollowBackLevel,
  FollowBackRateResult,
} from "@/features/relationship/services/followBackRateService";

type ResultsHeroProps = {
  followBackRate: FollowBackRateResult;
  notFollowingBackCount: number;
  onSeeWho: () => void;
};

// The glow takes the color of the follow-back level, like the loading
// screen's; the level is always written in the badge too, so color is
// never the only signal.
const levelStyles: Record<
  FollowBackLevel,
  { color: string; tone: BadgeTone; ringClass: string }
> = {
  balanced: {
    color: "var(--color-success)",
    tone: "success",
    ringClass: "stroke-success",
  },
  roomToImprove: {
    color: "var(--color-warning)",
    tone: "warning",
    ringClass: "stroke-warning",
  },
  oneWay: {
    color: "var(--color-danger)",
    tone: "danger",
    ringClass: "stroke-danger",
  },
  noData: {
    color: "var(--color-brand)",
    tone: "neutral",
    ringClass: "stroke-fg-faint",
  },
};

const RING_SIZE = 92;
const RING_STROKE = 9;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

const mix = (color: string, percent: number) =>
  `color-mix(in srgb, ${color} ${percent}%, transparent)`;

function heroSentence(count: number, following: number) {
  if (following === 0) return "You don't follow anyone in this export.";
  if (count === 0) return "Everyone you follow follows you back.";
  const people = following === 1 ? "person" : "people";
  const verb = count === 1 ? "doesn't" : "don't";
  return { following, people, verb };
}

// The answer people come for, first and biggest: how many of the people
// they follow don't follow them back, next to the follow-back rate.
export function ResultsHero({
  followBackRate,
  notFollowingBackCount,
  onSeeWho,
}: ResultsHeroProps) {
  const style = levelStyles[followBackRate.level];
  const sentence = heroSentence(
    notFollowingBackCount,
    followBackRate.followingCount
  );
  const cardStyle: CSSProperties = {
    background: [
      `radial-gradient(560px 260px at 12% 0%, ${mix(style.color, 20)}, transparent 70%)`,
      `radial-gradient(300px 220px at 92% 50%, ${mix(style.color, 10)}, transparent 70%)`,
      "var(--color-surface-1)",
    ].join(", "),
    borderColor: mix(style.color, 18),
  };

  return (
    <section
      aria-label="Who doesn't follow you back"
      style={cardStyle}
      className="shadow-elev-1 relative grid gap-5 overflow-hidden rounded-card border p-5 text-start sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-8"
    >
      <div className="min-w-0">
        <p className="text-fg-muted flex items-center gap-2 text-xs font-medium">
          <span aria-hidden="true" className="bg-data-3 size-2 rounded-full" />
          Don&apos;t follow you back
        </p>
        <p
          data-count={notFollowingBackCount}
          className="text-fg mt-2 text-[52px] leading-none font-semibold tracking-[-0.04em] tabular-nums sm:text-[64px]"
        >
          {notFollowingBackCount}
        </p>
        <p className="text-fg-muted mt-2 max-w-md text-base leading-snug sm:text-[17px]">
          {typeof sentence === "string" ? (
            sentence
          ) : (
            <>
              of the{" "}
              <strong className="text-fg font-semibold">
                {sentence.following} {sentence.people} you follow
              </strong>{" "}
              {sentence.verb} follow you back.
            </>
          )}
        </p>

        {notFollowingBackCount > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            <Button icon="arrowRight" iconPosition="right" onClick={onSeeWho}>
              See who
            </Button>
            <p className="text-fg-muted max-w-xs text-xs leading-snug">
              Includes people who unfollowed you and people who never followed
              back.
            </p>
          </div>
        )}
      </div>

      <div className="border-line-subtle flex items-center gap-4 border-t pt-4 lg:border-t-0 lg:pt-0">
        <div className="relative size-[92px] shrink-0">
          {/* The rate is the center of the orbits, like the avatar on the
              loading screen. Wide screens only: phones stay calm. */}
          <Orbits
            size={270}
            dotScale={1.1}
            className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 opacity-60 lg:block"
          />
          <svg
            viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
            className="relative size-full -rotate-90"
            aria-hidden="true"
          >
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_RADIUS}
              fill="none"
              strokeWidth={RING_STROKE}
              className="stroke-surface-2"
            />
            <circle
              data-ring={followBackRate.rate}
              data-ring-length={RING_LENGTH}
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_RADIUS}
              fill="none"
              strokeWidth={RING_STROKE}
              strokeLinecap="round"
              strokeDasharray={RING_LENGTH}
              strokeDashoffset={RING_LENGTH * (1 - followBackRate.rate / 100)}
              className={style.ringClass}
            />
          </svg>
          <span className="text-fg absolute inset-0 flex items-center justify-center text-xl font-semibold tabular-nums">
            <span data-count={followBackRate.rate}>{followBackRate.rate}</span>%
          </span>
        </div>

        <div className="relative min-w-0">
          <p className="text-fg-muted text-xs font-medium">Follow-back rate</p>
          <Badge tone={style.tone} size="sm" className="mt-1.5">
            {followBackRate.label}
          </Badge>
          <p className="text-fg-muted mt-1.5 text-xs">
            {followBackRate.mutualCount} of {followBackRate.followingCount}{" "}
            follow you back
          </p>
        </div>
      </div>
    </section>
  );
}
