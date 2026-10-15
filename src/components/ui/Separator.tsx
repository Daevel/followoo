import clsx from "clsx";

// One hairline color; spacing belongs to the parent layout.
export function Separator({ className }: { className?: string }) {
  return (
    <hr className={clsx("bg-line-subtle h-px w-full border-0", className)} />
  );
}
