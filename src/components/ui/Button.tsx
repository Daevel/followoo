import { clsx } from "clsx";
import { Icon, type IconName } from "./Icon";

type ButtonBackground = "primary" | "accent" | "bg";
type ButtonForeground = "primary" | "accent" | "bg" | "foreground";

interface ButtonProps {
  children: React.ReactNode;
  background?: ButtonBackground;
  foreground?: ButtonForeground;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  icon?: IconName;
  iconPosition?: "left" | "right";
}

export function Button({
  children,
  background = "primary",
  foreground = "foreground",
  onClick,
  disabled = false,
  className,
  type = "button",
  icon,
  iconPosition = "left",
}: ButtonProps) {
  const backgroundClasses: Record<ButtonBackground, string> = {
    primary: "bg-primary",
    accent: "bg-accent",
    bg: "bg-bg",
  };

  const backgroundHoverClasses: Record<ButtonBackground, string> = {
    primary: "hover:bg-primary/90 transition-colors",
    accent: "hover:bg-accent/90 transition-colors",
    bg: "",
  };

  const foregroundClasses: Record<ButtonForeground, string> = {
    primary: "text-primary",
    accent: "text-accent",
    bg: "text-bg",
    foreground: "text-foreground",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "inline-flex min-w-36.25 min-h-10 items-center justify-center gap-4 px-5 p1-b",
        backgroundClasses[background],
        foregroundClasses[foreground],
        !disabled && backgroundHoverClasses[background],
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      {icon && iconPosition === "left" && (
        <Icon
          name={icon}
          color={foreground}
          className="shrink-0"
          width={18}
          height={18}
          aria-hidden="true"
        />
      )}

      <span>{children}</span>

      {icon && iconPosition === "right" && (
        <Icon
          name={icon}
          color={foreground}
          className="shrink-0"
          width={18}
          height={18}
          aria-hidden="true"
        />
      )}
    </button>
  );
}