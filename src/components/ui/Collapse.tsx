import clsx from "clsx";
import {
  type ReactNode,
  type TransitionEvent,
  useEffect,
  useRef,
  useState,
} from "react";

type CollapseMotion = "toggle" | "entrance";

type CollapseProps = {
  open: boolean;
  children: ReactNode;
  /**
   * `toggle` (default): something the user opens and closes, like an FAQ
   * answer (300ms in, 200ms out). `entrance`: a block that arrives or
   * leaves on its own, like a card that loads after the page; it also
   * rises in like the page's other blocks (500ms in, 300ms out).
   */
  motion?: CollapseMotion;
  /** `x` opens sideways (a checkbox column); `y` (default) opens down. */
  axis?: "x" | "y";
  /** Unmount the content once closed, instead of keeping it hidden. */
  unmountOnClose?: boolean;
  id?: string;
  className?: string;
};

const EXIT_MS: Record<CollapseMotion, number> = { toggle: 200, entrance: 300 };

// The one way Followoo opens and closes things in place: the row grows
// from 0fr to 1fr (no height measuring) while the content fades. Clipping
// is only on while it moves, so shadows and focus rings show once open.
// "Reduce motion" is handled by the global rule in index.css. Closed
// content is inert: hidden from keyboard and screen readers.
export function Collapse({
  open,
  children,
  motion = "toggle",
  axis = "y",
  unmountOnClose = false,
  id,
  className,
}: CollapseProps) {
  const [isMounted, setIsMounted] = useState(open || !unmountOnClose);
  const [isOpen, setIsOpen] = useState(open);
  const [isSettled, setIsSettled] = useState(open);
  // What was on screen when it started closing, so it doesn't go blank.
  const lastChildren = useRef(children);
  if (open) lastChildren.current = children;

  // Runs only when `open` changes: on mount (and its Strict Mode re-run)
  // everything is already in place.
  const previousOpen = useRef(open);

  useEffect(() => {
    if (previousOpen.current === open) return;
    previousOpen.current = open;
    // Clip first: an unclipped 0fr row keeps its content's height, so
    // closing would do nothing. Then, two frames later (the clipped or
    // closed state painted), move.
    setIsSettled(false);
    if (open) setIsMounted(true);

    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setIsOpen(open));
    });
    // Normally unmounted on transitionend; this is the fallback (e.g. the
    // tab is in the background and no transition runs).
    const timer =
      !open && unmountOnClose
        ? window.setTimeout(() => setIsMounted(false), EXIT_MS[motion] + 150)
        : 0;

    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
      window.clearTimeout(timer);
    };
  }, [open, unmountOnClose, motion]);

  function handleTransitionEnd(event: TransitionEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    if (isOpen) setIsSettled(true);
    else if (!open && unmountOnClose) setIsMounted(false);
  }

  if (!isMounted) return null;

  const isEntrance = motion === "entrance";

  return (
    <div
      id={id}
      inert={!open}
      onTransitionEnd={handleTransitionEnd}
      className={clsx(
        "grid",
        axis === "y"
          ? "transition-[grid-template-rows,opacity]"
          : "transition-[grid-template-columns,opacity]",
        isOpen
          ? axis === "y"
            ? "grid-rows-[1fr]"
            : "grid-cols-[1fr]"
          : axis === "y"
            ? "grid-rows-[0fr]"
            : "grid-cols-[0fr]",
        isOpen ? "opacity-100" : "opacity-0",
        isOpen
          ? clsx(
              "ease-motion-out",
              isEntrance ? "duration-500" : "duration-300"
            )
          : clsx(
              "ease-motion-in",
              isEntrance ? "duration-300" : "duration-200"
            ),
        className
      )}
    >
      <div
        className={clsx(
          axis === "y" ? "min-h-0" : "min-w-0",
          !isSettled && "overflow-hidden"
        )}
      >
        <div
          className={clsx(
            isEntrance && "transition-transform",
            isEntrance &&
              (isOpen
                ? "ease-motion-out translate-y-0 duration-500"
                : "ease-motion-in translate-y-3.5 duration-300")
          )}
        >
          {open ? children : lastChildren.current}
        </div>
      </div>
    </div>
  );
}
