import { type RefObject, useRef } from "react";
import { gsap, useGSAP } from "../gsap";

const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/**
 * Results page entrance. Blocks rise in one after the other, then the
 * numbers count up from zero (`data-count`), the follow-back ring fills
 * (`data-ring` + `data-ring-length`) and the network bars grow
 * (`data-bar`). The DOM already holds the final values, so with reduced
 * motion nothing moves and everything is simply there.
 *
 * `listKey` changes when another list opens: its rows rise in again.
 */
export function useResultsPageAnimation(
  rootRef: RefObject<HTMLElement | null>,
  listKey?: string
) {
  const hasEnteredRef = useRef(false);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const heroItems = root.querySelectorAll('[data-animate="hero-item"]');
        const listItems = root.querySelectorAll('[data-animate="list-item"]');

        const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

        if (heroItems.length) {
          timeline.from(heroItems, {
            y: 20,
            opacity: 0,
            duration: 0.55,
            stagger: 0.08,
            clearProps: "all",
          });
        }

        if (listItems.length) {
          timeline.from(
            listItems,
            {
              y: 16,
              opacity: 0,
              duration: 0.4,
              stagger: 0.035,
              ease: "power2.out",
              clearProps: "all",
            },
            "-=0.2"
          );
        }

        for (const element of root.querySelectorAll<HTMLElement>(
          "[data-count]"
        )) {
          const target = Number(element.dataset.count);
          if (!Number.isFinite(target) || target === 0) continue;

          const counter = { value: 0 };
          element.textContent = "0";
          gsap.to(counter, {
            value: target,
            duration: 1,
            delay: 0.25,
            ease: "power2.out",
            onUpdate: () => {
              element.textContent = String(Math.round(counter.value));
            },
            onComplete: () => {
              element.textContent = String(target);
            },
          });
        }

        for (const ring of root.querySelectorAll<SVGCircleElement>(
          "[data-ring]"
        )) {
          gsap.from(ring, {
            attr: { "stroke-dashoffset": Number(ring.dataset.ringLength) },
            duration: 1.1,
            delay: 0.25,
            ease: "power2.out",
          });
        }

        const bars = root.querySelectorAll("[data-bar]");
        if (bars.length) {
          gsap.from(bars, {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 0.9,
            delay: 0.35,
            stagger: 0.12,
            ease: "power3.out",
            clearProps: "transform",
          });
        }
      });

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  useGSAP(
    () => {
      if (!hasEnteredRef.current) {
        hasEnteredRef.current = true;
        return;
      }
      const root = rootRef.current;
      if (!root) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const rows = root.querySelectorAll('[data-animate="list-item"]');
        if (rows.length) {
          gsap.from(rows, {
            y: 8,
            opacity: 0,
            duration: 0.35,
            stagger: 0.04,
            ease: "power2.out",
            clearProps: "all",
          });
        }
      });

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [listKey] }
  );
}
