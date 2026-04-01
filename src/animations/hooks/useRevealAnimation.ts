import type { RefObject } from "react";
import { gsap, useGSAP } from "../gsap";
import { animationPresets } from "../presets";

type RevealVariant = "revealUp" | "revealDown" | "fadeIn";

type UseRevealAnimationOptions = {
  selector?: string;
  variant?: RevealVariant;
  delay?: number;
  once?: boolean;
  start?: string;
};

export function useRevealAnimation(
  rootRef: RefObject<HTMLElement | null>,
  options: UseRevealAnimationOptions = {},
) {
  const {
    selector,
    variant = "revealUp",
    delay = 0,
    once = true,
    start = "top 85%",
  } = options;

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const target = selector
        ? root.querySelector<HTMLElement>(selector)
        : root;

      if (!target) return;

      const preset = animationPresets[variant];

      gsap.fromTo(target, preset.from, {
        ...preset.to,
        delay,
        scrollTrigger: {
          trigger: target,
          start,
          once,
        },
      });
    },
    { scope: rootRef },
  );
}
