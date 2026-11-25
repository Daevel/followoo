import clsx from "clsx";

type TabButtonProps = {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  /** Inside a list with a `TabIndicator`, which draws the active background. */
  withIndicator?: boolean;
  className?: string;
};

// One segment of a segmented control: the selected tab is raised on
// surface-2 instead of being filled with color.
export function TabButton({
  children,
  active,
  onClick,
  withIndicator = false,
  className,
}: TabButtonProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={clsx(
        "ease-motion-out inline-flex min-h-8 cursor-pointer items-center justify-center gap-1.5 rounded-[9px] px-3 py-1.5 text-[13px] font-medium break-words transition-colors duration-150",
        "focus-visible:shadow-ring focus-visible:outline-none",
        withIndicator
          ? clsx("relative", active ? "text-fg" : "text-fg-muted hover:text-fg")
          : active
            ? "bg-surface-2 text-fg shadow-elev-1"
            : "text-fg-muted hover:bg-surface-2/60 hover:text-fg",
        className
      )}
    >
      {children}
    </button>
  );
}
