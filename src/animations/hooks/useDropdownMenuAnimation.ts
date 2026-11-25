import { type RefObject, useLayoutEffect } from "react";
import { gsap } from "../gsap";
import { motion } from "../tokens";

/**
 * Opening motion shared by every menu (sort, "More lists", …): fades in,
 * drops 4px and grows slightly from the corner it opens from.
 */
export function useDropdownMenuAnimation(
  menuRef: RefObject<HTMLElement | null>,
  isOpen: boolean,
  origin: "top left" | "top right" = "top left"
) {
  useLayoutEffect(() => {
    if (!isOpen || !menuRef.current) return;

    gsap.fromTo(
      menuRef.current,
      { opacity: 0, y: -4, scale: 0.97, transformOrigin: origin },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: motion.duration.base,
        ease: motion.ease.out,
      }
    );
  }, [isOpen, menuRef, origin]);
}
