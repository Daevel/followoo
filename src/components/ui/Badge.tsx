import clsx from "clsx";
import type { ReactNode } from "react";

export type BadgeTone = "neutral" | "brand" | "success" | "warning" | "danger";

// The tone colors the text (and border/fill only for brand); a status badge
// still needs a word or icon, never color alone.
const toneClasses: Record<BadgeTone, string> = {
  neutral: "border-line-subtle bg-surface-2 text-fg",
  brand: "border-brand-fg/20 bg-brand-fg/10 text-brand-fg",
  success: "border-line-subtle bg-surface-2 text-success",
  warning: "border-line-subtle bg-surface-2 text-warning",
  danger: "border-line-subtle bg-surface-2 text-danger",
};

const sizeClasses = {
  sm: "h-5 px-2 text-xs",
  md: "h-6 px-2.5 text-[13px]",
};

type BadgeProps = {
  children: ReactNode;
  tone?: BadgeTone;
  size?: keyof typeof sizeClasses;
  /** Leading color dot, e.g. a persona's data color class (`bg-data-3`). */
  dotClass?: string;
  icon?: ReactNode;
  className?: string;
};

export function Badge({
  children,
  tone = "neutral",
  size = "md",
  dotClass,
  icon,
  className,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border font-medium whitespace-nowrap",
        toneClasses[tone],
        sizeClasses[size],
        className
      )}
    >
      {dotClass && (
        <span
          aria-hidden="true"
          className={clsx("size-1.5 shrink-0 rounded-full", dotClass)}
        />
      )}
      {icon}
      {children}
    </span>
  );
}
