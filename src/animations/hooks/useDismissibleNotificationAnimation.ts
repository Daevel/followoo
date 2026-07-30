import { type RefObject, useCallback, useRef } from "react";
import { gsap, useGSAP } from "../gsap";

export function useDismissibleNotificationAnimation(
  rootRef: RefObject<HTMLElement | null>
) {
  const isClosingRef = useRef(false);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const isMobile = window.matchMedia("(max-width: 639px)").matches;
      const enterFromY = isMobile ? 24 : -16;

      gsap.fromTo(
        root,
        {
          opacity: 0,
          y: enterFromY,
          scale: 0.98,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.35,
          ease: "power3.out",
        }
      );
    },
    { scope: rootRef }
  );

  const closeWithAnimation = useCallback(
    (onComplete?: () => void) => {
      const root = rootRef.current;

      if (!root || isClosingRef.current) return;

      isClosingRef.current = true;

      const isMobile = window.matchMedia("(max-width: 639px)").matches;
      const exitToY = isMobile ? 16 : -12;

      gsap.to(root, {
        opacity: 0,
        y: exitToY,
        scale: 0.98,
        duration: 0.22,
        ease: "power2.in",
        onComplete,
      });
    },
    [rootRef]
  );

  return {
    closeWithAnimation,
  };
}
