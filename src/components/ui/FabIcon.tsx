import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";
import {
  type ButtonSize,
  type ButtonVariant,
  buttonClasses,
  buttonIconSize,
} from "./Button";
import { Icon, type IconName } from "./Icon";

type FabIconProps = {
  icon: IconName;
  /** Required: an icon-only button has no visible text for screen readers. */
  "aria-label": string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "aria-label">;

export function FabIcon({
  icon,
  variant = "secondary",
  size = "md",
  disabled = false,
  className,
  type = "button",
  ...props
}: FabIconProps) {
  const iconSize = buttonIconSize[size];

  return (
    <button
      type={type}
      disabled={disabled}
      className={clsx(
        buttonClasses({ variant, size, iconOnly: true }),
        className
      )}
      {...props}
    >
      <Icon
        name={icon}
        color="current"
        width={iconSize}
        height={iconSize}
        className="shrink-0"
        aria-hidden="true"
      />
    </button>
  );
}
