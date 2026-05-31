import { Icon, type IconName } from "./Icon";

type CardProps = {
  title: string;
  description: string;
  className?: string;
  color?: "primary" | "accent" | "bg" | "foreground";
  iconName?: IconName | null;
  children?: React.ReactNode;
};

const textColorMap: Record<NonNullable<CardProps["color"]>, string> = {
  primary: "text-foreground",
  accent: "text-foreground",
  bg: "text-foreground",
  foreground: "text-bg",
};

const iconWrapperBgMap: Record<NonNullable<CardProps["color"]>, string> = {
  primary: "bg-foreground",
  accent: "bg-foreground",
  bg: "bg-foreground",
  foreground: "bg-bg",
};

const iconColorMap: Record<
  NonNullable<CardProps["color"]>,
  "bg" | "foreground"
> = {
  primary: "bg",
  accent: "bg",
  bg: "bg",
  foreground: "foreground",
};

export function Card({
  title = "",
  description = "",
  className = "",
  iconName = null,
  color = "primary",
  children,
}: CardProps) {
  const textColorClass = textColorMap[color];
  const iconWrapperBg = iconWrapperBgMap[color];
  const iconColor = iconColorMap[color];

  return (
    <div
      key={title}
      className={`bg-${color} ${textColorClass} rounded-[10px] px-6 py-8 text-center sm:px-8 sm:py-10 ${className}`}
    >
      {iconName && (
        <div
          className={`${iconWrapperBg} mx-auto flex aspect-square w-24 items-center justify-center rounded-[10px] sm:w-28 md:w-32`}
        >
          <Icon
            name={iconName}
            color={iconColor}
            className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14"
          />
        </div>
      )}

      <div className="mt-8 flex flex-col items-center gap-y-4">
        <h3>{title}</h3>
        <p className="max-w-xs">{description}</p>
      </div>

      {children && (
        <div className="flex flex-row mt-8 gap-2 justify-center">
          {children}
        </div>
      )}
    </div>
  );
}
