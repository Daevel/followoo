import clsx from "clsx";

type SpinnerSize = "sm" | "md" | "lg";
type SpinnerColor = "primary" | "accent" | "foreground" | "white";

type SpinnerProps = {
  size?: SpinnerSize;
  color?: SpinnerColor;
  className?: string;
  label?: string;
};

const sizeClasses: Record<SpinnerSize, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-[3px]",
};

const colorClasses: Record<SpinnerColor, string> = {
  primary: "border-primary/20 border-t-primary",
  accent: "border-accent/20 border-t-accent",
  foreground: "border-foreground/20 border-t-foreground",
  white: "border-white/20 border-t-white",
};

export function SkeletonLoaderCircle({
  size = "md",
  color = "primary",
  className,
  label = "Loading",
}: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={clsx("inline-flex items-center justify-center", className)}
    >
      <div
        className={clsx(
          "animate-spin rounded-full border-solid",
          sizeClasses[size],
          colorClasses[color],
        )}
      />
    </div>
  );
}
