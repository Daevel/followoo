import clsx from "clsx";
import type {
  RelationshipHealthLevel,
  RelationshipHealthResult,
} from "@/features/relationship/services/relationshipHealthService";
import { Badge, type BadgeTone } from "./Badge";
import { Icon, type IconName } from "./Icon";

type RelationshipHealthInsightProps = {
  insight: RelationshipHealthResult;
};

// The level is told by word + face icon in the badge, color only reinforces it.
const levelStyles: Record<
  RelationshipHealthLevel,
  { label: string; icon: IconName; tone: BadgeTone; barClass: string }
> = {
  healthy: {
    label: "Good",
    icon: "happyFace",
    tone: "success",
    barClass: "bg-success",
  },
  average: {
    label: "Intermediate",
    icon: "neutralFace",
    tone: "warning",
    barClass: "bg-warning",
  },
  critical: {
    label: "Critical",
    icon: "sadFace",
    tone: "danger",
    barClass: "bg-danger",
  },
};

export function RelationshipHealthInsight({
  insight,
}: RelationshipHealthInsightProps) {
  const { label, icon, tone, barClass } = levelStyles[insight.level];
  const score = Math.max(0, Math.min(100, insight.score));

  return (
    <div className="border-line-subtle bg-surface-1 shadow-elev-1 w-full min-w-0 rounded-card border p-5 text-start sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-fg-muted text-xs font-medium">Network health</p>

          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-fg text-[32px] leading-none font-semibold tracking-[-0.03em] tabular-nums">
              {insight.score}
            </span>
            <span className="text-fg-faint text-sm">/100</span>
          </div>
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
          {label}
        </Badge>
      </div>

      {/* decorative: the score is already readable as text above */}
      <div
        aria-hidden="true"
        className="bg-surface-2 mt-4 h-1.5 w-full overflow-hidden rounded-full"
      >
        <div
          className={clsx("h-full rounded-full", barClass)}
          style={{ width: `${score}%` }}
        />
      </div>
      <h3 className="text-fg mt-4 text-base leading-snug font-semibold break-words">
        {insight.title}
      </h3>
      <p className="text-fg-muted mt-1 max-w-xl text-[13px] leading-[1.55]">
        {insight.description}
      </p>
    </div>
  );
}
