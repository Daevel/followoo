import clsx from "clsx";
import type {
  FollowBackLevel,
  FollowBackRateResult,
} from "@/features/relationship/services/followBackRateService";
import { Badge, type BadgeTone } from "./Badge";
import { Icon, type IconName } from "./Icon";

type FollowBackRateCardProps = {
  result: FollowBackRateResult;
};

// The level is told by word + face icon in the badge, color only reinforces it.
const levelStyles: Record<
  FollowBackLevel,
  { icon: IconName; tone: BadgeTone; barClass: string }
> = {
  balanced: { icon: "happyFace", tone: "success", barClass: "bg-success" },
  roomToImprove: {
    icon: "neutralFace",
    tone: "warning",
    barClass: "bg-warning",
  },
  oneWay: { icon: "sadFace", tone: "danger", barClass: "bg-danger" },
  noData: { icon: "neutralFace", tone: "neutral", barClass: "bg-fg-faint" },
};

export function FollowBackRateCard({ result }: FollowBackRateCardProps) {
  const { icon, tone, barClass } = levelStyles[result.level];
  const rate = Math.max(0, Math.min(100, result.rate));

  return (
    <div className="border-line-subtle bg-surface-1 shadow-elev-1 w-full min-w-0 rounded-card border p-5 text-start sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-fg-muted text-xs font-medium">Follow-back rate</p>

          <p className="text-fg mt-2 text-[32px] leading-none font-semibold tracking-[-0.03em] tabular-nums">
            {result.rate}%
          </p>
        </div>

        <Badge
          tone={tone}
          icon={
            <Icon
              name={icon}
              color="current"
              width={14}
              height={14}
              aria-hidden="true"
            />
          }
        >
          {result.label}
        </Badge>
      </div>

      {/* decorative: the rate is already readable as text above */}
      <div
        aria-hidden="true"
        className="bg-surface-2 mt-4 h-1.5 w-full overflow-hidden rounded-full"
      >
        <div
          className={clsx("h-full rounded-full", barClass)}
          style={{ width: `${rate}%` }}
        />
      </div>
      <h3 className="text-fg mt-4 text-base leading-snug font-semibold break-words">
        {result.summary}
      </h3>
      <p className="text-fg-muted mt-1 max-w-xl text-[13px] leading-[1.55]">
        {result.hint}
      </p>
    </div>
  );
}
