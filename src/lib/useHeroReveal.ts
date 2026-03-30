import type { RefObject } from "react";
import { gsap, useGSAP } from "../lib/gsap";

type UseHeroRevealOptions = {
  copySelector?: string;
  titleSelector?: string;
  trustSelector?: string;
  actionsSelector?: string;
  visualSelector?: string;
  coinsSelector?: string;
};

export function useHeroReveal(
  containerRef: RefObject<HTMLElement | null>,
  {
    copySelector = ".hero-copy",
    titleSelector = ".hero-title",
    trustSelector = ".hero-trust",
    actionsSelector = ".hero-actions",
    visualSelector = ".hero-visual",
    coinsSelector = ".hero-coin-item",
  }: UseHeroRevealOptions = {},
) {
  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        gsap.set(
          [
            copySelector,
            titleSelector,
            trustSelector,
            actionsSelector,
            visualSelector,
            coinsSelector,
          ],
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            clearProps: "all",
          },
        );
        return;
      }

      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      tl.from(copySelector, {
        opacity: 0,
        y: 34,
        scale: 0.985,
        filter: "blur(12px)",
        duration: 1.05,
      })
        .from(
          titleSelector,
          {
            opacity: 0,
            y: 18,
            filter: "blur(8px)",
            duration: 0.8,
          },
          "-=0.7",
        )
        .from(
          trustSelector,
          {
            opacity: 0,
            y: 16,
            duration: 0.55,
          },
          "-=0.55",
        )
        .from(
          `${actionsSelector} > *`,
          {
            opacity: 0,
            y: 14,
            scale: 0.98,
            duration: 0.5,
            stagger: 0.08,
          },
          "-=0.35",
        )
        .from(
          visualSelector,
          {
            opacity: 0,
            y: 36,
            scale: 0.965,
            filter: "blur(12px)",
            duration: 1.1,
          },
          "-=0.45",
        )
        .from(
          coinsSelector,
          {
            opacity: 0,
            y: 20,
            duration: 0.55,
            stagger: 0.1,
          },
          "-=0.55",
        );
    },
    { scope: containerRef },
  );
}
