import clsx from "clsx";

type TabButtonProps = {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
};

// One segment of a segmented control: the selected tab is raised on
// surface-2 instead of being filled with color.
export function TabButton({ children, active, onClick }: TabButtonProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={clsx(
        "inline-flex min-h-8 cursor-pointer items-center justify-center gap-1.5 rounded-[9px] px-3 py-1.5 text-[13px] font-medium break-words transition-colors",
        "focus-visible:shadow-ring focus-visible:outline-none",
        active
          ? "bg-surface-2 text-fg shadow-elev-1"
          : "text-fg-muted hover:bg-surface-2/60 hover:text-fg"
      )}
    >
      {children}
    </button>
  );
}
