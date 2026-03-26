import clsx from "clsx";
import type {
  RelationshipHealthLevel,
  RelationshipHealthResult,
} from "../services/relationshipHealthService";
import { Icon, type IconColor, type IconName } from "./Icon";

type RelationshipHealthInsightProps = {
  insight: RelationshipHealthResult;
};

function HealthFace({ level }: { level: RelationshipHealthLevel }) {
  const faceColorClass = {
    healthy: "text-primary border-primary/30 bg-primary/10",
    average: "text-foreground border-foreground/20 bg-foreground/5",
    critical: "text-accent border-accent/30 bg-accent/10",
  }[level];

  const iconName = {
    healthy: "happyFace",
    average: "neutralFace",
    critical: "sadFace",
  }[level] as IconName;

  const iconColor = {
    healthy: "primary",
    average: "foreground",
    critical: "accent",
  }[level] as IconColor;

  return (
    <div
      className={clsx(
        "flex h-16 w-16 shrink-0 items-center justify-center rounded-full border md:h-18 md:w-18",
        faceColorClass,
      )}
      aria-hidden="true"
    >
      <Icon name={iconName} width={80} height={80} color={iconColor} />
    </div>
  );
}

export function RelationshipHealthInsight({
  insight,
}: RelationshipHealthInsightProps) {
  const accentClass = {
    healthy: "text-primary",
    average: "text-foreground",
    critical: "text-accent",
  }[insight.level];

  const badgeClass = {
    healthy: "border-primary/20 bg-primary/10 text-primary",
    average: "border-foreground/15 bg-foreground/5 text-foreground",
    critical: "border-accent/20 bg-accent/10 text-accent",
  }[insight.level];

  return (
    <div className="border-foreground/10 w-full rounded-3xl border bg-white/5 p-5 md:p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <HealthFace level={insight.level} />

          <div className="text-start">
            <p className="text-foreground/60 text-xs tracking-[0.18em] uppercase">
              Network health
            </p>

            <h3 className="text-foreground mt-1 text-xl font-semibold">
              {insight.title}
            </h3>

            <p className="text-foreground/75 mt-2 max-w-xl text-sm leading-6">
              {insight.description}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 md:items-end">
          <div
            className={clsx(
              "rounded-2xl border px-4 py-2 text-sm font-medium",
              badgeClass,
            )}
          >
            {insight.level === "healthy" && "Good"}
            {insight.level === "average" && "Intermediate"}
            {insight.level === "critical" && "Critical"}
          </div>

          <div className="text-start md:text-end">
            <p className="text-foreground/60 text-xs tracking-[0.18em] uppercase">
              Score
            </p>
            <p
              className={clsx(
                "text-3xl font-semibold md:text-4xl",
                accentClass,
              )}
            >
              {insight.score}
              <span className="text-foreground/50 ml-1 text-base font-medium">
                /100
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
