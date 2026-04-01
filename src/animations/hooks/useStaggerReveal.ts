import type { RefObject } from "react";
import { gsap, useGSAP } from "../gsap";
import { animationTokens } from "../tokens";

type UseStaggerRevealOptions = {
  selector: string;
  start?: string;
  once?: boolean;
  stagger?: number;
};

export function useStaggerReveal(
  rootRef: RefObject<HTMLElement | null>,
  options: UseStaggerRevealOptions,
) {
  const {
    selector,
    start = "top 85%",
    once = true,
    stagger = animationTokens.stagger.base,
  } = options;

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const items = root.querySelectorAll(selector);
      if (!items.length) return;

      gsap.fromTo(
        items,
        {
          autoAlpha: 0,
          y: animationTokens.distance.lg,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: animationTokens.duration.slow,
          ease: animationTokens.ease.entrance,
          stagger,
          scrollTrigger: {
            trigger: root,
            start,
            once,
          },
        },
      );
    },
    { scope: rootRef },
  );
}
