import clsx from "clsx";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  /** `prose` (768px) for reading pages, `app` (1120px) for dashboards and charts. */
  size?: "prose" | "app";
};

const sizeClasses = {
  prose: "max-w-3xl",
  app: "max-w-[1120px]",
};

export function Container({
  children,
  className = "",
  size = "prose",
}: ContainerProps) {
  return (
    <div
      className={clsx(
        "mx-auto w-full px-5 sm:px-6 lg:px-8",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  );
}
