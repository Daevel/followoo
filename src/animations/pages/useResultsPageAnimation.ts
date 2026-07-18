import type { RefObject } from "react";
import { gsap, useGSAP } from "../gsap";

export function useResultsPageAnimation(
  rootRef: RefObject<HTMLElement | null>
) {
  useGSAP(
    () => {
      if (!rootRef.current) return;

      const heroItems = rootRef.current.querySelectorAll(
        '[data-animate="hero-item"]'
      );
      const listItems = rootRef.current.querySelectorAll(
        '[data-animate="list-item"]'
      );

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      if (heroItems.length) {
        timeline.from(heroItems, {
          y: 20,
          opacity: 0,
          duration: 0.55,
          stagger: 0.08,
          clearProps: "all",
        });
      }

      if (listItems.length) {
        timeline.from(
          listItems,
          {
            y: 16,
            opacity: 0,
            duration: 0.4,
            stagger: 0.035,
            ease: "power2.out",
            clearProps: "all",
          },
          "-=0.2"
        );
      }
    },
    { scope: rootRef }
  );
}
