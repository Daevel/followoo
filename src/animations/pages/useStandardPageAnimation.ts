import type { RefObject } from "react";
import { gsap, useGSAP } from "../gsap";

type UseStandardPageAnimationOptions = {
  animateItems?: boolean;
  itemSelector?: string;
};

export function useStandardPageAnimation(
  rootRef: RefObject<HTMLElement | null>,
  options: UseStandardPageAnimationOptions = {},
) {
  const { animateItems = true, itemSelector = "[data-page-animate='item']" } =
    options;

  useGSAP(
    () => {
      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline
        .fromTo(
          "[data-page-animate='heading']",
          {
            autoAlpha: 0,
            y: 16,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
          },
        )
        .fromTo(
          "[data-page-animate='subheading']",
          {
            autoAlpha: 0,
            y: 14,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
          },
          "-=0.35",
        )
        .fromTo(
          "[data-page-animate='callout']",
          {
            autoAlpha: 0,
            y: 12,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.4,
          },
          "-=0.25",
        )
        .fromTo(
          "[data-page-animate='content']",
          {
            autoAlpha: 0,
            y: 14,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
          },
          "-=0.2",
        );

      if (animateItems) {
        gsap.fromTo(
          itemSelector,
          {
            autoAlpha: 0,
            y: 14,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.4,
            ease: "power3.out",
            stagger: 0.05,
            delay: 0.1,
          },
        );
      }
    },
    { scope: rootRef },
  );
}
