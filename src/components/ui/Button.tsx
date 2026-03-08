import { clsx } from "clsx";

interface ButtonProps {
  children: React.ReactNode;
  color?: "primary" | "accent" | "bg";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function Button({
  children,
  color,
  onClick,
  disabled = false,
  className,
}: ButtonProps) {
  const colorClasses = {
    primary: "bg-primary",
    accent: "bg-accent",
    bg: "bg-bg",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "inline-flex min-w-36.25 min-h-10 items-center justify-center text-base px-5 p1-b mt-10",
        color && colorClasses[color],
        disabled && color === "accent" && "opacity-60 cursor-not-allowed",
        className,
      )}
    >
      {children}
    </button>
  );
}
