import clsx from "clsx";
import { Icon, type IconName } from "./Icon";

type CardProps = {
  title: string;
  description: string;
  className?: string;
  /** `brand` tints the icon tile; the surface itself always stays neutral. */
  tone?: "default" | "brand";
  iconName?: IconName | null;
  children?: React.ReactNode;
};

export function Card({
  title = "",
  description = "",
  className = "",
  iconName = null,
  tone = "default",
  children,
}: CardProps) {
  return (
    <div
      className={clsx(
        "border-line-subtle bg-surface-1 shadow-elev-1 h-full rounded-card border p-5 text-start sm:p-6",
        className
      )}
    >
      {iconName && (
        <div
          className={clsx(
            "mb-5 flex size-9 items-center justify-center rounded-control border",
            tone === "brand"
              ? "border-brand-fg/20 bg-brand-fg/10 text-brand-fg"
              : "border-line-strong bg-surface-2 text-fg-muted"
          )}
        >
          <Icon
            name={iconName}
            color="current"
            width={18}
            height={18}
            aria-hidden="true"
          />
        </div>
      )}
      <h3 className="text-fg text-base leading-snug font-semibold tracking-[-0.01em]">
        {title}
      </h3>
      <p className="text-fg-muted mt-1.5 text-sm leading-[1.55]">
        {description}
      </p>

      {children && <div className="mt-5 flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}
