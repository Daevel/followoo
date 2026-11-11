import clsx from "clsx";

type SpinnerSize = "sm" | "md" | "lg";

type SpinnerProps = {
  size?: SpinnerSize;
  className?: string;
  label?: string;
};

// One color everywhere: brand-fg arc on a surface-2 track. Inside a Button
// use its `loading` prop instead of composing this spinner by hand.
const sizeClasses: Record<SpinnerSize, string> = {
  sm: "size-3.5 border-[1.5px]",
  md: "size-5 border-2",
  lg: "size-8 border-2",
};

export function SkeletonLoaderCircle({
  size = "md",
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
          "border-surface-2 border-t-brand-fg animate-spin rounded-full border-solid [animation-duration:0.8s]",
          sizeClasses[size]
        )}
      />
    </div>
  );
}
