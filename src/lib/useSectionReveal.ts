import type { RefObject } from "react";
import { gsap, useGSAP } from "../lib/gsap";

type UseSectionRevealOptions = {
  cardSelector?: string;
  headingSelector?: string;
  subheadingSelector?: string;
  triggerStart?: string;
};

export function useSectionReveal(
  containerRef: RefObject<HTMLElement | null>,
  {
    cardSelector = ".feature-card",
    headingSelector = ".section-heading",
    subheadingSelector = ".section-subheading",
    triggerStart = "top 75%",
  }: UseSectionRevealOptions = {},
) {
  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: triggerStart,
          once: true,
        },
        defaults: {
          ease: "power3.out",
        },
      });

      tl.from(headingSelector, {
        y: 24,
        opacity: 0,
        duration: 0.7,
      })
        .from(
          subheadingSelector,
          {
            y: 18,
            opacity: 0,
            duration: 0.55,
          },
          "-=0.35",
        )
        .from(
          cardSelector,
          {
            y: 32,
            opacity: 0,
            duration: 0.7,
            stagger: 0.12,
          },
          "-=0.2",
        );
    },
    { scope: containerRef },
  );
}
