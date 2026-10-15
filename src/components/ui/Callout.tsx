import clsx from "clsx";
import { type FeedbackVariant, feedbackVariants } from "./feedbackVariants";
import { Icon, type IconName } from "./Icon";

interface CalloutProps {
  title: string;
  children: React.ReactNode;
  /** `danger` is only for errors that block the user; show it next to the cause. */
  variant?: FeedbackVariant;
  icon?: IconName;
  className?: string;
}

export function Callout({
  title,
  children,
  variant = "info",
  icon,
  className,
}: CalloutProps) {
  const { icon: defaultIcon, iconClass } = feedbackVariants[variant];
  const isBlocking = variant === "danger";

  return (
    <div
      role={isBlocking ? "alert" : undefined}
      className={clsx(
        "flex w-full items-start gap-3 rounded-control border px-4 py-3.5",
        isBlocking
          ? "border-danger/25 bg-danger/6"
          : "border-line-subtle bg-surface-1",
        className
      )}
    >
      <Icon
        name={icon ?? defaultIcon}
        color="current"
        width={18}
        height={18}
        className={clsx("mt-px shrink-0", iconClass)}
        aria-hidden="true"
      />

      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="text-fg text-sm font-semibold">{title}</p>

        <div className="text-fg-muted text-[13px] leading-[1.55]">
          {children}
        </div>
      </div>
    </div>
  );
}
