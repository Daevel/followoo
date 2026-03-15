import clsx from "clsx";
import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
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

export function Toast({
  toast,
  onClose,
  duration = 4000,
}: ToastProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const isClosingRef = useRef(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        rootRef.current,
        {
          opacity: 0,
          y: 16,
          scale: 0.98,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.35,
          ease: "power3.out",
        },
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const handleClose = () => {
    if (!rootRef.current || isClosingRef.current) return;

    isClosingRef.current = true;

    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    gsap.to(rootRef.current, {
      opacity: 0,
      y: 12,
      scale: 0.98,
      duration: 0.22,
      ease: "power2.in",
      onComplete: () => {
        onClose(toast.id);
      },
    });
  };

  useEffect(() => {
    closeTimeoutRef.current = window.setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, [duration, toast.id]);

  const styles = variantStyles[toast.variant];

  return (
    <div
      ref={rootRef}
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
          onClick={handleClose}
          className="text-foreground/60 transition hover:text-foreground cursor-pointer"
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