import clsx from "clsx";
import { type ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Icon } from "./Icon";

type ModalProps = {
  children: ReactNode;
  onClose: () => void;
  /** id of the heading inside the modal, for `aria-labelledby`. */
  labelledBy: string;
  /** Blocks every way of closing (button, Esc, scrim), e.g. while saving. */
  closeDisabled?: boolean;
  className?: string;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Dialog rendered on document.body, so no ancestor (a sticky NavBar with
// backdrop-filter, a GSAP transform) can become the containing block of
// its `position: fixed` and push it off screen. Centered from `sm`, a
// bottom sheet on phones. Esc and the scrim close it; focus stays inside
// while it is open and returns to the trigger afterwards.
export function Modal({
  children,
  onClose,
  labelledBy,
  closeDisabled = false,
  className,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const onCloseRef = useRef(onClose);
  const closeDisabledRef = useRef(closeDisabled);
  onCloseRef.current = onClose;
  closeDisabledRef.current = closeDisabled;

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const firstField = panel.querySelector<HTMLElement>(
      "input:not([disabled]), textarea:not([disabled])"
    );
    (firstField ?? panel).focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (!closeDisabledRef.current) onCloseRef.current();
        return;
      }

      if (event.key !== "Tab" || !panel) return;

      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE)
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close dialog"
        onClick={() => {
          if (!closeDisabled) onClose();
        }}
        className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-[2px]"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={clsx(
          "border-line-strong bg-surface-1 shadow-elev-2 relative max-h-[90svh] w-full overflow-y-auto border-t p-6 pb-[max(24px,env(safe-area-inset-bottom))] text-start outline-none",
          "rounded-t-[22px] sm:max-w-md sm:rounded-card sm:border sm:pb-6",
          className
        )}
      >
        <span
          aria-hidden="true"
          className="bg-line-strong mx-auto -mt-2 mb-4 block h-1 w-9 rounded-full sm:hidden"
        />

        <button
          type="button"
          onClick={onClose}
          disabled={closeDisabled}
          aria-label="Close"
          className="text-fg-muted hover:text-fg focus-visible:shadow-ring absolute top-4 right-4 rounded-control outline-none disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Icon
            name="close"
            color="current"
            width={20}
            height={20}
            aria-hidden="true"
          />
        </button>

        {children}
      </div>
    </div>,
    document.body
  );
}
