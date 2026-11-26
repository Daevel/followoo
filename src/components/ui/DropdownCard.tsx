import { useId, useState } from "react";
import { Collapse } from "@/components/ui/Collapse";
import { Icon } from "@/components/ui/Icon.tsx";

type DropdownCardProps = {
  title: string;
  description: string;
};

export function DropdownCard({ title, description }: DropdownCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="border-line-subtle bg-surface-1 w-full rounded-card border transition-colors">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="focus-visible:shadow-ring flex w-full cursor-pointer items-center justify-between gap-6 rounded-card px-5 py-4 focus-visible:outline-none"
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <h4 className="text-fg pr-4 text-start text-[15px] leading-snug font-medium">
          {title}
        </h4>

        <div className="text-fg-muted flex shrink-0 items-center justify-center">
          <div
            className={
              isOpen
                ? "rotate-180 transition-transform duration-300 ease-motion-out"
                : "transition-transform duration-300 ease-motion-out"
            }
          >
            <Icon
              name="singleArrowDown"
              color="current"
              width={16}
              height={16}
              aria-hidden="true"
            />
          </div>
        </div>
      </button>

      <Collapse open={isOpen} id={panelId}>
        <p className="text-fg-muted px-5 pb-4 text-start text-sm leading-relaxed">
          {description}
        </p>
      </Collapse>
    </div>
  );
}
