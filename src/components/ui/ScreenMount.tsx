import clsx from "clsx";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";

export type ScreenMountPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top-center"
  | "bottom-center"
  | "center"
  /** Bottom, full width on phones (clear of the header and menu); top-right from `sm`. */
  | "toast";

const positionClassNameMap: Record<ScreenMountPosition, string> = {
  "top-left": "top-[calc(1rem+env(safe-area-inset-top))] left-4 items-start",
  "top-right": "top-[calc(1rem+env(safe-area-inset-top))] right-4 items-end",
  "bottom-left":
    "bottom-[calc(1rem+env(safe-area-inset-bottom))] left-4 items-start",
  "bottom-right":
    "bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 items-end",
  "top-center":
    "top-[calc(1rem+env(safe-area-inset-top))] left-1/2 -translate-x-1/2 items-center",
  "bottom-center":
    "bottom-[calc(1rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 items-center",
  center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center",
  toast:
    "bottom-[calc(1rem+env(safe-area-inset-bottom))] inset-x-4 items-stretch sm:inset-x-auto sm:bottom-auto sm:top-[calc(1rem+env(safe-area-inset-top))] sm:right-4 sm:items-end",
};

type ScreenMountProps = {
  position?: ScreenMountPosition;
  children: ReactNode;
  className?: string;
};

export function ScreenMount({
  position = "top-right",
  children,
  className,
}: ScreenMountProps) {
  if (typeof window === "undefined") {
    return null;
  }

  const portalTarget = document.body;

  return createPortal(
    <div
      className={clsx(
        "pointer-events-none fixed z-50 flex flex-col gap-3",
        positionClassNameMap[position],
        className
      )}
    >
      {children}
    </div>,
    portalTarget
  );
}
