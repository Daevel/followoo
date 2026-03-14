import clsx from "clsx";
import { Icon, type IconName } from "./Icon";

export type ToastVariant = "info" | "success" | "warning";

export type ToastItem = {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
};

type ToastProps = {
  toast: ToastItem;
  onClose: (id: string) => void;
};

const variantStyles: Record<
  ToastVariant,
  {
    container: string;
    title: string;
    body: string;
    iconColor: "primary" | "accent" | "bg" | "foreground";
    defaultIcon: IconName;
  }
> = {
  info: {
    container: "border border-primary bg-primary/10",
    title: "text-primary",
    body: "text-foreground",
    iconColor: "primary",
    defaultIcon: "help",
  },
  success: {
    container: "border border-primary bg-primary/10",
    title: "text-primary",
    body: "text-foreground",
    iconColor: "primary",
    defaultIcon: "check",
  },
  warning: {
    container: "border border-accent bg-accent/10",
    title: "text-accent",
    body: "text-foreground",
    iconColor: "accent",
    defaultIcon: "warning",
  },
};

export function Toast({ toast, onClose }: ToastProps) {
  const styles = variantStyles[toast.variant];

  return (
    <div
      role="status"
      aria-live="polite"
      className={clsx(
        "pointer-events-auto w-full p-4 shadow-lg backdrop-blur-sm",
        styles.container,
      )}
    >
      <div className="flex items-start gap-3">
        <Icon
          name={styles.defaultIcon}
          color={styles.iconColor}
          width={24}
          height={24}
          className="mt-0.5 shrink-0"
          aria-hidden="true"
        />

        <div className="min-w-0 flex-1">
          <p className={clsx("text-sm font-semibold", styles.title)}>
            {toast.title}
          </p>

          {toast.description ? (
            <p className={clsx("mt-1 text-sm leading-5", styles.body)}>
              {toast.description}
            </p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => onClose(toast.id)}
          className="text-foreground/60 transition hover:text-foreground"
          aria-label="Dismiss notification"
        >
          ×
        </button>
      </div>
    </div>
  );
}