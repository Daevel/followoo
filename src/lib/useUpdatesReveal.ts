import type { RefObject } from "react";
import { gsap, useGSAP } from "../lib/gsap";

type UseUpdatesRevealOptions = {
  iconSelector?: string;
  headingSelector?: string;
  cardSelector?: string;
  triggerStart?: string;
};

export function useUpdatesReveal(
  containerRef: RefObject<HTMLElement | null>,
  {
    headingSelector = ".update-heading",
    cardSelector = ".update-card",
    triggerStart = "top 75%",
  }: UseUpdatesRevealOptions = {},
) {
  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) {
        gsap.set([headingSelector, cardSelector], {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          clearProps: "all",
        });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: triggerStart,
          once: true,
        },
        defaults: {
          ease: "power3.out",
        },
      });

      tl.from(headingSelector, {
        opacity: 0,
        y: 18,
        scale: 0.96,
        filter: "blur(8px)",
        duration: 0.6,
      })

        .from(
          cardSelector,
          {
            opacity: 0,
            y: 20,
            filter: "blur(6px)",
            duration: 0.55,
            stagger: 0.1,
          },
          "-=0.3",
        );
    },
    { scope: containerRef },
  );
}
