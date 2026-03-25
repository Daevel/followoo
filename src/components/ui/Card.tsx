import { useCardHoverAnimation } from "@/lib/useCardHoverAnimation";
import { useRef } from "react";
import { Icon, type IconName } from "./Icon";

type CardProps = {
  title: string;
  description: string;
  iconName: IconName;
};

export function Card({
  title = "",
  description = "",
  iconName = "shield",
}: CardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  useCardHoverAnimation(cardRef);

  return (
    <>
      <div
        key={title}
        className="feature-card bg-primary text-foreground rounded-[20px] px-6 py-8 text-center sm:px-8 sm:py-10"
      >
        <div className="feature-icon-wrapper bg-foreground mx-auto flex aspect-square w-24 items-center justify-center rounded-[20px] sm:w-28 md:w-32">
          <Icon
            name={iconName}
            color="bg"
            className="feature-icon h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14"
          />
        </div>

        <div className="mt-8 flex flex-col items-center gap-y-4">
          <h3>{title}</h3>
          <p className="max-w-xs">{description}</p>
        </div>
      </div>
    </>
  );
}
