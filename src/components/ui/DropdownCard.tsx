import {useState} from "react";
import {Icon} from "@/components/ui/Icon.tsx";

type DropdownCardProps = {
    title: string;
    description: string;
};

export function DropdownCard({ title, description }: DropdownCardProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className="
        w-full max-w-190
        rounded-[20px] bg-foreground text-bg
        px-8 py-7
        transition-all duration-300 ease-out
      "
        >
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex w-full justify-between gap-6 items-center"
                aria-expanded={isOpen}
            >
                <h4 className="pr-4 text-start">{title}</h4>

                <div
                    className="
            flex h-8 w-8 shrink-0 items-center justify-center
            rounded-full bg-primary
            transition-transform duration-300 ease-out
          "
                >
                    <div className={isOpen ? "rotate-180 transition-transform duration-300 ease-out" : "transition-transform duration-300 ease-out"}>
                        <Icon
                            name="singleArrowDown"
                            color="foreground"
                            width={18}
                            height={18}
                        />
                    </div>
                </div>
            </button>

            <div
                className={`
          grid overflow-hidden transition-all duration-300 ease-out
          ${isOpen ? "mt-6 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
        `}
            >
                <div className="min-h-0 text-start">
                    <p className="p1-r">{description}</p>
                </div>
            </div>
        </div>
    );
}