import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand text-on-brand shadow-[inset_0_1px_0_rgb(255_255_255/0.16),0_1px_2px_rgb(0_0_0/0.4)] enabled:hover:bg-brand-hover",
  secondary:
    "border-line-strong bg-surface-2 text-fg enabled:hover:border-fg-faint",
  ghost:
    "bg-transparent text-fg-muted enabled:hover:bg-surface-2 enabled:hover:text-fg",
  danger:
    "border-danger/30 bg-danger/10 text-danger enabled:hover:bg-danger/15",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-[13px]",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-[15px]",
};

const iconOnlySizeClasses: Record<ButtonSize, string> = {
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
};

export const buttonIconSize: Record<ButtonSize, number> = {
  sm: 14,
  md: 16,
  lg: 18,
};

// Shared by Button and FabIcon so both stay one visual family.
export function buttonClasses({
  variant,
  size,
  iconOnly = false,
}: {
  variant: ButtonVariant;
  size: ButtonSize;
  iconOnly?: boolean;
}) {
  return clsx(
    "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-control border border-transparent font-medium tracking-[-0.005em] transition-colors",
    "focus-visible:shadow-ring focus-visible:outline-none",
    "disabled:cursor-not-allowed disabled:opacity-45",
    variantClasses[variant],
    iconOnly ? iconOnlySizeClasses[size] : sizeClasses[size]
  );
}

interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  iconPosition?: "left" | "right";
  /** Shows a spinner, disables the button and sets aria-busy. */
  loading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  type = "button",
  className,
  ...props
}: ButtonProps) {
  const iconSize = buttonIconSize[size];
  const iconElement = icon && (
    <Icon
      name={icon}
      color="current"
      width={iconSize}
      height={iconSize}
      className="shrink-0"
      aria-hidden="true"
    />
  );

  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={clsx(buttonClasses({ variant, size }), className)}
      {...props}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="size-3.5 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      ) : (
        iconPosition === "left" && iconElement
      )}

      <span>{children}</span>

      {!loading && iconPosition === "right" && iconElement}
    </button>
  );
}
