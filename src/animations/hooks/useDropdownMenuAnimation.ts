import { type RefObject, useLayoutEffect } from "react";
import { gsap } from "../gsap";

export function useDropdownMenuAnimation(
  menuRef: RefObject<HTMLElement | null>,
  isOpen: boolean
) {
  useLayoutEffect(() => {
    if (!isOpen || !menuRef.current) return;

    gsap.fromTo(
      menuRef.current,
      {
        opacity: 0,
        y: -8,
        scale: 0.98,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      }
    );
  }, [isOpen, menuRef]);
}
