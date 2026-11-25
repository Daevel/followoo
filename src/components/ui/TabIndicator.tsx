import clsx from "clsx";
import { type RefObject, useLayoutEffect, useRef, useState } from "react";

type TabIndicatorProps = {
  /** The tablist; it must be `relative`. */
  containerRef: RefObject<HTMLElement | null>;
  /** Changes when another tab is selected, so the indicator moves. */
  activeKey: string;
};

type Box = { x: number; y: number; width: number; height: number };

/**
 * The raised background of a segmented control's selected tab, drawn once
 * and slid to whichever tab is selected (200ms, motion "base"). Tabs inside
 * use `TabButton` with `withIndicator`, so they draw no background of
 * their own. It follows layout changes (wrapping, resizes) without
 * animating them, and hides when no tab in the list is selected.
 */
export function TabIndicator({ containerRef, activeKey }: TabIndicatorProps) {
  const [box, setBox] = useState<Box | null>(null);
  const [canAnimate, setCanAnimate] = useState(false);
  const previousKeyRef = useRef(activeKey);
  const isShownRef = useRef(false);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isNewTab = previousKeyRef.current !== activeKey;
    previousKeyRef.current = activeKey;

    const measure = (animate: boolean) => {
      const tab = container.querySelector<HTMLElement>(
        '[role="tab"][aria-selected="true"]'
      );
      // Slide only from a visible position; appear in place otherwise.
      setCanAnimate(animate && isShownRef.current);
      isShownRef.current = Boolean(tab);
      if (!tab) {
        setBox(null);
        return;
      }
      setBox({
        x: tab.offsetLeft,
        y: tab.offsetTop,
        width: tab.offsetWidth,
        height: tab.offsetHeight,
      });
    };

    // Slide when the selection changes; jump when the layout changes.
    measure(isNewTab);

    const observer = new ResizeObserver(() => measure(false));
    observer.observe(container);
    return () => observer.disconnect();
  }, [containerRef, activeKey]);

  if (!box) return null;

  return (
    <span
      aria-hidden="true"
      className={clsx(
        "bg-surface-2 shadow-elev-1 pointer-events-none absolute top-0 left-0 rounded-[9px]",
        canAnimate &&
          "ease-motion-out transition-[transform,width,height] duration-200"
      )}
      style={{
        transform: `translate(${box.x}px, ${box.y}px)`,
        width: box.width,
        height: box.height,
      }}
    />
  );
}
