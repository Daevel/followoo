import type { RefObject } from "react";
import { gsap, useGSAP } from "../lib/gsap";

type UseFaqRevealOptions = {
  iconSelector?: string;
  headingSelector?: string;
  cardSelector?: string;
  triggerStart?: string;
};

export function useFaqReveal(
  containerRef: RefObject<HTMLElement | null>,
  {
    iconSelector = ".faq-icon",
    headingSelector = ".faq-heading",
    cardSelector = ".faq-card",
    triggerStart = "top 75%",
  }: UseFaqRevealOptions = {},
) {
  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) {
        gsap.set([iconSelector, headingSelector, cardSelector], {
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

      tl.from(iconSelector, {
        opacity: 0,
        y: 18,
        scale: 0.96,
        filter: "blur(8px)",
        duration: 0.6,
      })
        .from(
          headingSelector,
          {
            opacity: 0,
            y: 24,
            filter: "blur(10px)",
            duration: 0.8,
          },
          "-=0.35",
        )
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
