import clsx from "clsx";
import { useCallback, useEffect, useRef } from "react";
import { useDismissibleNotificationAnimation } from "@/animations/hooks/useDismissibleNotificationAnimation";
import { Button } from "./Button";
import { type FeedbackVariant, feedbackVariants } from "./feedbackVariants";
import { Icon } from "./Icon";

// Toasts float over unpredictable content, so every variant (errors too)
// stays on an opaque, neutral surface: the variant shows only in the icon.
export type ToastVariant = FeedbackVariant;

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

  const { icon, iconClass } = feedbackVariants[toast.variant];

  return (
    <div
      ref={rootRef}
      role="status"
      aria-live="polite"
      className="border-line-strong bg-surface-2 shadow-elev-2 pointer-events-auto box-border w-full rounded-xl border p-4"
    >
      <div className="grid grid-cols-[auto_1fr_auto] items-start gap-3">
        <Icon
          name={icon}
          color="current"
          width={18}
          height={18}
          className={clsx("mt-px shrink-0", iconClass)}
          aria-hidden="true"
        />

        <div className="min-w-0">
          <p className="text-fg text-sm font-semibold">{toast.title}</p>

          {toast.description ? (
            <p className="text-fg-muted mt-0.5 text-[13px] leading-5 break-words">
              {toast.description}
            </p>
          ) : null}

          {toast.action ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleActionClick}
              className="mt-3"
            >
              {toast.action.label}
            </Button>
          ) : null}
        </div>

        <button
          type="button"
          onClick={handleClose}
          className="text-fg-faint hover:text-fg focus-visible:shadow-ring shrink-0 cursor-pointer rounded-md transition-colors focus-visible:outline-none"
          aria-label="Dismiss notification"
        >
          <Icon
            name="close"
            color="current"
            width={16}
            height={16}
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}
