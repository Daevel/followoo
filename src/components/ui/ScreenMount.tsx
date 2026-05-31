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
  | "center";

const positionClassNameMap: Record<ScreenMountPosition, string> = {
  "top-left": "top-4 left-4 items-start",
  "top-right": "top-4 right-4 items-end",
  "bottom-left": "bottom-4 left-4 items-start",
  "bottom-right": "bottom-4 right-4 items-end",
  "top-center": "top-4 left-1/2 -translate-x-1/2 items-center",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center",
  center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center",
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
