import { useState } from "react";
import { Icon } from "@/components/ui/Icon.tsx";

type DropdownCardProps = {
  title: string;
  description: string;
};

export function DropdownCard({ title, description }: DropdownCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-line-subtle bg-surface-1 w-full max-w-190 rounded-card border transition-colors">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="focus-visible:shadow-ring flex w-full cursor-pointer items-center justify-between gap-6 rounded-card px-5 py-4 focus-visible:outline-none"
        aria-expanded={isOpen}
      >
        {/* `!`: the global unlayered h4 size in index.css beats utilities */}
        <h4 className="text-fg pr-4 text-start text-[15px]! leading-snug font-medium">
          {title}
        </h4>

        <div className="text-fg-muted flex shrink-0 items-center justify-center">
          <div
            className={
              isOpen
                ? "rotate-180 transition-transform duration-300 ease-out"
                : "transition-transform duration-300 ease-out"
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

      <div
        className={`grid overflow-hidden transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"} `}
      >
        <div className="min-h-0 text-start">
          <p className="text-fg-muted px-5 pb-4 text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
