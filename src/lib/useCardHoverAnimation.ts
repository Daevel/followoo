import type { RefObject } from "react";
import { gsap, useGSAP } from "../lib/gsap";

export function useCardHoverAnimation(
  cardRef: RefObject<HTMLDivElement | null>,
) {
  useGSAP(
    () => {
      const card = cardRef.current;
      if (!card) return;

      const iconWrapper = card.querySelector(".feature-icon-wrapper");
      const icon = card.querySelector(".feature-icon");

      if (!iconWrapper || !icon) return;

      const onEnter = () => {
        gsap.to(card, {
          y: -8,
          scale: 1.015,
          duration: 0.28,
          ease: "power2.out",
        });

        gsap.to(iconWrapper, {
          y: -4,
          scale: 1.04,
          duration: 0.28,
          ease: "power2.out",
        });

        gsap.to(icon, {
          scale: 1.08,
          duration: 0.28,
          ease: "power2.out",
        });
      };

      const onLeave = () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          duration: 0.32,
          ease: "power2.out",
        });

        gsap.to(iconWrapper, {
          y: 0,
          scale: 1,
          duration: 0.32,
          ease: "power2.out",
        });

        gsap.to(icon, {
          scale: 1,
          duration: 0.32,
          ease: "power2.out",
        });
      };

      card.addEventListener("mouseenter", onEnter);
      card.addEventListener("mouseleave", onLeave);

      return () => {
        card.removeEventListener("mouseenter", onEnter);
        card.removeEventListener("mouseleave", onLeave);
      };
    },
    { scope: cardRef },
  );
}
