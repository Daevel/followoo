import clsx from "clsx";
import { useCallback, useEffect, useRef } from "react";
import { useDismissibleNotificationAnimation } from "@/animations/hooks/useDismissibleNotificationAnimation";
import { Icon, type IconName } from "./Icon";

export type ToastVariant = "info" | "success" | "warning";

export type ToastItem = {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
};

type ToastProps = {
  toast: ToastItem;
  onClose: (id: string) => void;
  duration?: number;
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

export function Toast({ toast, onClose, duration = 4000 }: ToastProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const { closeWithAnimation } = useDismissibleNotificationAnimation(rootRef);

  const handleClose = useCallback(() => {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    closeWithAnimation(() => {
      toast.onClose?.();
      onClose(toast.id);
    });
  }, [closeWithAnimation, onClose, toast]);

  function handleActionClick() {
    toast.action?.onClick();
    handleClose();
  }

  useEffect(() => {
    if (!Number.isFinite(duration)) {
      return;
    }

    closeTimeoutRef.current = window.setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, [duration, handleClose]);

  const styles = variantStyles[toast.variant];

  return (
    <div
      ref={rootRef}
      role="status"
      aria-live="polite"
      className={clsx(
        "pointer-events-auto box-border w-full rounded-[10px] p-4 shadow-lg backdrop-blur-sm",
        styles.container
      )}
    >
      <div className="grid grid-cols-[auto_1fr_auto] items-start gap-3">
        <Icon
          name={styles.defaultIcon}
          color={styles.iconColor}
          width={24}
          height={24}
          className="mt-0.5 shrink-0"
          aria-hidden="true"
        />

        <div className="min-w-0">
          <p className={clsx("text-sm font-semibold", styles.title)}>
            {toast.title}
          </p>

          {toast.description ? (
            <p
              className={clsx(
                "mt-1 text-sm leading-5 break-words",
                styles.body
              )}
            >
              {toast.description}
            </p>
          ) : null}

          {toast.action ? (
            <button
              type="button"
              onClick={handleActionClick}
              className={clsx(
                "mt-3 cursor-pointer text-sm font-semibold underline underline-offset-4 transition hover:opacity-80",
                styles.title
              )}
            >
              {toast.action.label}
            </button>
          ) : null}
        </div>

        <button
          type="button"
          onClick={handleClose}
          className="text-foreground/60 hover:text-foreground shrink-0 cursor-pointer transition"
          aria-label="Dismiss notification"
        >
          <Icon
            name="close"
            color="foreground"
            width={24}
            height={24}
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}
