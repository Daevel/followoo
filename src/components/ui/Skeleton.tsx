export type SkeletonShape = "circle" | "rectangle";

export type SkeletonProps = {
  size?: "sm" | "md" | "lg";
  ariaLabel?: string;
  className?: string;
  animation?: "pulse" | "wave";
  shape: SkeletonShape;
};

const sizeClasses: Record<string, string> = {
  sm: "h-4 w-16",
  md: "h-6 w-32",
  lg: "h-8 w-48",
};

const shapeClasses: Record<SkeletonShape, string> = {
  circle: "rounded-full",
  rectangle: "rounded-md",
};

const skeletonAnimationStyle = `
  @keyframes skeletonShimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }

  .skeleton-wave-animation {
    background: linear-gradient(
      90deg,
      #d1d5db 0%,
      #e5e7eb 50%,
      #d1d5db 100%
    );
    background-size: 1000px 100%;
    animation: skeletonShimmer 2s infinite;
  }
`;

export function Skeleton({
  size = "md",
  ariaLabel,
  className,
  animation = "wave",
  shape,
}: SkeletonProps) {
  const baseClasses = "bg-gray-300 transition-colors";
  const animationClass =
    animation === "pulse" ? "animate-pulse" : "skeleton-wave-animation";
  const combinedClasses = `${sizeClasses[size]} ${shapeClasses[shape]} ${baseClasses} ${animationClass} ${className || ""}`;

  return (
    <>
      <style>{skeletonAnimationStyle}</style>
      <div aria-label={ariaLabel} role="status" className={combinedClasses} />
    </>
  );
}
