export type SkeletonProps = {
  size?: "sm" | "md" | "lg";
  ariaLabel?: string;
  className?: string;
};

export function Skeleton({ size, ariaLabel, className }: SkeletonProps) {
  return (
    <div className={className} aria-label={ariaLabel} role="status">
      {size === "sm" && (
        <div className="w-16 h-4 rounded-md bg-gray-300 transition-colors"></div>
      )}
      {size === "md" && (
        <div className="w-32 h-6 rounded-md bg-gray-300 transition-colors"></div>
      )}
      {size === "lg" && (
        <div className="w-64 h-8 rounded-md bg-gray-300 transition-colors"></div>
      )}
    </div>
  );
}
