import clsx from "clsx";
import { Icon, type IconName } from "./Icon";

type CalloutVariant = "info" | "warning";

interface CalloutProps {
  title: string;
  children: React.ReactNode;
  variant?: CalloutVariant;
  icon?: IconName;
  className?: string;
}

const variantStyles: Record<
  CalloutVariant,
  {
    container: string;
    title: string;
    body: string;
    iconColor: "primary" | "accent" | "bg" | "foreground";
    defaultIcon: IconName;
  }
> = {
  info: {
    container: "bg-primary/10 border border-primary ",
    title: "text-primary",
    body: "text-foreground",
    iconColor: "primary",
    defaultIcon: "help",
  },
  warning: {
    container: "bg-accent/10 border border-accent ",
    title: "text-accent",
    body: "text-foreground",
    iconColor: "accent",
    defaultIcon: "warning",
  }
};

export function Callout({
  title,
  children,
  variant = "info",
  icon,
  className,
}: CalloutProps) {
  const styles = variantStyles[variant];
  const iconName = icon ?? styles.defaultIcon;

  return (
    <div className={clsx("w-full p-4", styles.container, className)}>
      <div className="flex items-start gap-3">
        <Icon
          name={iconName}
          color={styles.iconColor}
          width={24}
          height={24}
          className="shrink-0 mt-0.5"
          aria-hidden="true"
        />

        <div className="flex flex-col gap-1">
          <p className={clsx("text-base font-semibold", styles.title)}>
            {title}
          </p>

          <div className={clsx("text-sm leading-6", styles.body)}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
