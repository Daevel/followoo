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
            y: 24,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
          },
        )
        .fromTo(
          "[data-page-animate='subheading']",
          {
            autoAlpha: 0,
            y: 18,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
          },
          "-=0.45",
        )
        .fromTo(
          "[data-page-animate='callout']",
          {
            autoAlpha: 0,
            y: 16,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
          },
          "-=0.3",
        )
        .fromTo(
          "[data-page-animate='content']",
          {
            autoAlpha: 0,
            y: 20,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.65,
          },
          "-=0.25",
        );

      if (animateItems) {
        gsap.fromTo(
          itemSelector,
          {
            autoAlpha: 0,
            y: 20,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            ease: "power3.out",
            stagger: 0.08,
            delay: 0.2,
          },
        );
      }
    },
    { scope: rootRef },
  );
}
