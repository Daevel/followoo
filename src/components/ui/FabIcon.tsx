import clsx from "clsx";
import { Icon, type IconName } from "./Icon";

type ButtonBackground = "primary" | "accent" | "bg";
type ButtonForeground = "primary" | "accent" | "bg" | "foreground";

type FabIconProps = {
  background?: ButtonBackground;
  foreground?: ButtonForeground;
  icon?: IconName;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function FabIcon({
  background = "primary",
  foreground = "foreground",
  disabled = false,
  className,
  icon,
  type = "button",
  ...props
}: FabIconProps) {
  const backgroundClasses: Record<ButtonBackground, string> = {
    primary: "bg-primary",
    accent: "bg-accent",
    bg: "bg-bg",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={clsx(
        "p1-b inline-flex h-10 w-10 items-center justify-center rounded-[10px]",
        backgroundClasses[background],
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
      {...props}
    >
      {icon && (
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
