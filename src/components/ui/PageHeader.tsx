import clsx from "clsx";
import type { ReactNode } from "react";

type PageHeaderProps = {
  /** Short label above the title, in brand text (e.g. "Support", "Legal"). */
  kicker: string;
  title: ReactNode;
  description?: ReactNode;
  /** Row under the description, e.g. a "Last updated" badge. */
  meta?: ReactNode;
  /** Right-aligned on wide screens, below the text on phones. */
  actions?: ReactNode;
  /** Drops the bottom padding when the header shares a column with content. */
  flush?: boolean;
  className?: string;
};

// Title block for content pages (support, legal, updates). Carries the
// `data-page-animate` hooks used by useStandardPageAnimation.
export function PageHeader({
  kicker,
  title,
  description,
  meta,
  actions,
  flush = false,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={clsx(
        "flex flex-col gap-6 pt-12 text-start md:flex-row md:items-end md:justify-between md:pt-16",
        !flush && "pb-8 md:pb-10",
        className
      )}
    >
      <div className="min-w-0">
        <p
          data-page-animate="heading"
          className="text-brand-fg text-[13px] font-medium"
        >
          {kicker}
        </p>
        <h1
          data-page-animate="heading"
          className="text-fg mt-2.5 text-[32px] leading-[1.08] font-semibold tracking-[-0.035em] text-balance md:text-[40px]"
        >
          {title}
        </h1>
        {description && (
          <p
            data-page-animate="subheading"
            className="text-fg-muted mt-3.5 max-w-[560px] text-base leading-7 md:text-[17px]"
          >
            {description}
          </p>
        )}
        {meta && (
          <div
            data-page-animate="subheading"
            className="text-fg-muted mt-4 flex flex-wrap items-center gap-2.5 text-[13px]"
          >
            {meta}
          </div>
        )}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </header>
  );
}
