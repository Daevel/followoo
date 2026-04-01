import type { RefObject } from "react";
import { gsap, useGSAP } from "../gsap";
import { animationPresets } from "../presets";

type UseHoverLiftOptions = {
  cardSelector?: string;
  nestedSelectors?: {
    target: string;
    enter?: gsap.TweenVars;
    leave?: gsap.TweenVars;
  }[];
  disabled?: boolean;
};

export function useHoverLift(
  rootRef: RefObject<HTMLElement | null>,
  options: UseHoverLiftOptions = {},
) {
  const { cardSelector, nestedSelectors = [], disabled = false } = options;

  useGSAP(
    (_, contextSafe) => {
      if (disabled) return;

      const root = rootRef.current;
      if (!root) return;

      const target = cardSelector
        ? root.querySelector<HTMLElement>(cardSelector)
        : root;

      if (!target) return;

      const safe = <T extends (...args: any[]) => any>(fn: T): T => {
        return contextSafe ? contextSafe(fn) : fn;
      };

      const onEnter = safe(() => {
        gsap.to(target, animationPresets.hoverLift.cardEnter);

        nestedSelectors.forEach(({ target: selector, enter }) => {
          const el = root.querySelector(selector);
          if (!el) return;

          gsap.to(el, enter ?? animationPresets.hoverLift.iconEnter);
        });
      });

      const onLeave = safe(() => {
        gsap.to(target, animationPresets.hoverLift.cardLeave);

        nestedSelectors.forEach(({ target: selector, leave }) => {
          const el = root.querySelector(selector);
          if (!el) return;

          gsap.to(el, leave ?? animationPresets.hoverLift.iconLeave);
        });
      });

      target.addEventListener("mouseenter", onEnter);
      target.addEventListener("mouseleave", onLeave);

      return () => {
        target.removeEventListener("mouseenter", onEnter);
        target.removeEventListener("mouseleave", onLeave);
      };
    },
    { scope: rootRef },
  );
}
