import clsx from "clsx";
import type { ReactNode } from "react";

type ChartCardProps = {
  title: string;
  description?: string;
  /** Right side of the header, e.g. a period switch. */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

// Shared shell for the results charts: neutral card, quiet header.
export function ChartCard({
  title,
  description,
  action,
  children,
  className,
}: ChartCardProps) {
  return (
    <section
      className={clsx(
        "border-line-subtle bg-surface-1 shadow-elev-1 flex w-full min-w-0 flex-col gap-5 rounded-card border p-5 text-start sm:p-6",
        className
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          {/* `!`: the global unlayered h3 size in index.css beats utilities */}
          <h3 className="text-fg text-base! leading-snug font-semibold tracking-[-0.01em]">
            {title}
          </h3>
          {description && (
            <p className="text-fg-muted mt-1 text-[13px] leading-[1.55]">
              {description}
            </p>
          )}
        </div>
        {action}
      </div>

      {children}
    </section>
  );
}

type Stat = { label: string; value: ReactNode; detail?: ReactNode };

// Stats in one bordered block split by hairlines (gap-px over line-subtle).
export function ChartStats({ stats }: { stats: Stat[] }) {
  return (
    <dl
      className={clsx(
        "border-line-subtle bg-line-subtle grid gap-px overflow-hidden rounded-control border",
        stats.length === 4
          ? "grid-cols-2 sm:grid-cols-4"
          : "grid-cols-1 sm:grid-cols-3"
      )}
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-surface-1 flex flex-col gap-1.5 p-4"
        >
          <dt className="text-fg-muted text-xs font-medium">{stat.label}</dt>
          <dd className="text-fg text-xl leading-tight font-semibold tracking-[-0.02em] tabular-nums">
            {stat.value}
          </dd>
          {stat.detail && (
            <dd className="text-fg-muted text-xs leading-5">{stat.detail}</dd>
          )}
        </div>
      ))}
    </dl>
  );
}
