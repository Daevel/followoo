export type SkeletonShape = "circle" | "rectangle";

export type SkeletonSize = "sm" | "md" | "lg";

export type SkeletonAnimation = "pulse" | "wave";

export type SkeletonVariant = "block" | "text" | "card" | "list";

export type SkeletonProps = {
  variant?: SkeletonVariant;
  size?: SkeletonSize;
  shape?: SkeletonShape;
  lines?: number;
  items?: number;
  count?: number;
  ariaLabel?: string;
  className?: string;
  itemClassName?: string;
  animation?: SkeletonAnimation;
};

type SkeletonBlockProps = {
  size?: SkeletonSize;
  shape?: SkeletonShape;
  ariaLabel?: string;
  className?: string;
  animation?: SkeletonAnimation;
};

const sizeClasses: Record<SkeletonSize, string> = {
  sm: "h-4 w-16",
  md: "h-6 w-32",
  lg: "h-8 w-48",
};

const shapeClasses: Record<SkeletonShape, string> = {
  circle: "rounded-full",
  rectangle: "rounded-md",
};

const animationClasses: Record<SkeletonAnimation, string> = {
  pulse: "animate-pulse",
  wave: "skeleton-wave-animation",
};

function createSkeletonItems(prefix: string, count: number) {
  return Array.from({ length: count }, (_, index) => ({
    id: `${prefix}-${index + 1}`,
  }));
}

function getLastLineClass(index: number, total: number) {
  return index === total - 1 ? "w-2/3" : "w-full";
}

function SkeletonBlock({
  size = "md",
  shape = "rectangle",
  ariaLabel = "Loading",
  className = "",
  animation = "wave",
}: SkeletonBlockProps) {
  const combinedClasses = [
    "skeleton-base transition-colors overflow-hidden",
    sizeClasses[size],
    shapeClasses[shape],
    animationClasses[animation],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div role="status" aria-label={ariaLabel} className={combinedClasses} />
  );
}

export function Skeleton({
  variant = "block",
  size = "md",
  shape = "rectangle",
  lines = 3,
  items = 3,
  count = 1,
  ariaLabel = "Loading",
  className = "",
  itemClassName = "",
  animation = "wave",
}: SkeletonProps) {
  if (count > 1) {
    const skeletonItems = createSkeletonItems("skeleton-count", count);

    return (
      <div className={className}>
        {skeletonItems.map((item) => (
          <Skeleton
            key={item.id}
            variant={variant}
            size={size}
            shape={shape}
            lines={lines}
            items={items}
            count={1}
            ariaLabel={ariaLabel}
            animation={animation}
            className={itemClassName}
          />
        ))}
      </div>
    );
  }

  if (variant === "text") {
    const skeletonLines = createSkeletonItems("skeleton-text-line", lines);

    return (
      <div
        role="status"
        aria-label={ariaLabel}
        className={`flex flex-col gap-2 ${className}`}
      >
        {skeletonLines.map((line, index) => (
          <SkeletonBlock
            key={line.id}
            animation={animation}
            className={`h-4 ${getLastLineClass(index, skeletonLines.length)}`}
          />
        ))}
      </div>
    );
  }

  if (variant === "card") {
    const skeletonLines = createSkeletonItems("skeleton-card-line", lines);

    return (
      <div
        role="status"
        aria-label={ariaLabel}
        className={`rounded-lg border border-gray-200 p-4 ${className}`}
      >
        <SkeletonBlock animation={animation} className="mb-4 h-40 w-full" />

        <div className="flex flex-col gap-2">
          {skeletonLines.map((line, index) => (
            <SkeletonBlock
              key={line.id}
              animation={animation}
              className={`h-4 ${getLastLineClass(index, skeletonLines.length)}`}
            />
          ))}
        </div>
      </div>
    );
  }

  if (variant === "list") {
    const skeletonListItems = createSkeletonItems("skeleton-list-item", items);
    const skeletonLines = createSkeletonItems("skeleton-list-line", lines);

    return (
      <div
        role="status"
        aria-label={ariaLabel}
        className={`flex flex-col gap-4 ${className}`}
      >
        {skeletonListItems.map((item) => (
          <div key={item.id} className="flex items-top gap-3 mt-4">
            <SkeletonBlock
              animation={animation}
              shape="circle"
              className="h-10 w-10 shrink-0"
            />

            <div className="flex w-full flex-col gap-2">
              {skeletonLines.map((line, index) => (
                <SkeletonBlock
                  key={`${item.id}-${line.id}`}
                  animation={animation}
                  className={`h-4 ${getLastLineClass(index, skeletonLines.length)}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <SkeletonBlock
      size={size}
      shape={shape}
      ariaLabel={ariaLabel}
      animation={animation}
      className={className}
    />
  );
}
