import { type RefObject, useRef } from "react";
import { gsap, useGSAP } from "@/animations/gsap";
import { readThemeColor } from "@/components/ui/charts/chartTheme";
import {
  RELATIONSHIP_GROUPS,
  type RelationshipGroupCounts,
} from "@/features/relationship/constants/relationshipGroups";
import { allocateDots, assignDotsToOrbits } from "../utils/analysisNetwork";

type UseAnalysisNetworkAnimationOptions = {
  scopeRef: RefObject<SVGSVGElement | null>;
  /** Real group counts; the dots sort themselves into orbits once known. */
  counts: RelationshipGroupCounts | null;
  shouldSettle: boolean;
  /** Slow rotation and stronger lines on wide screens only. */
  isWide: boolean;
  reduceMotion: boolean;
};

// GSAP interpolates the fill, so it needs the theme's actual color values,
// read when the dots settle.
const groupColors = () =>
  Object.fromEntries(
    RELATIONSHIP_GROUPS.map((group) => [group.key, readThemeColor(group.color)])
  );

// Timeline of the analysis loading network: the constellation draws itself,
// turns slowly (wide screens), then each dot glides to its group's orbit and
// takes its color. With reduced motion every step is applied instantly.
export function useAnalysisNetworkAnimation({
  scopeRef,
  counts,
  shouldSettle,
  isWide,
  reduceMotion,
}: UseAnalysisNetworkAnimationOptions) {
  const rotationRef = useRef<gsap.core.Tween | null>(null);
  const hasSettledRef = useRef(false);
  const lineOpacity = isWide ? 0.24 : 0.16;

  useGSAP(
    () => {
      const svg = scopeRef.current;
      if (!svg) return;

      const dots = svg.querySelectorAll("[data-network-dot]");
      const lines = svg.querySelectorAll("[data-network-line]");
      const fieldRings = svg.querySelectorAll("[data-network-field-ring]");
      const eyes = svg.querySelectorAll("[data-network-eyes]");

      if (reduceMotion) {
        gsap.set(dots, { opacity: 1 });
        gsap.set(lines, { opacity: lineOpacity });
        gsap.set(fieldRings, { opacity: 1 });
        return;
      }

      // The background rings open outwards, one after the other.
      gsap.fromTo(
        fieldRings,
        { opacity: 0, scale: 0.92, svgOrigin: "0 0" },
        {
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: "power2.out",
          stagger: 0.12,
        }
      );

      gsap.fromTo(
        dots,
        { opacity: 0, scale: 0, transformOrigin: "50% 50%" },
        {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: "back.out(2)",
          stagger: { each: 1.1 / Math.max(dots.length, 1) },
        }
      );
      gsap.fromTo(
        lines,
        { opacity: 0 },
        {
          opacity: lineOpacity,
          duration: 0.3,
          stagger: { each: 1.1 / Math.max(lines.length, 1) },
        }
      );

      if (isWide) {
        rotationRef.current = gsap.to("[data-network-rotor]", {
          rotation: 360,
          svgOrigin: "0 0",
          duration: 50,
          repeat: -1,
          ease: "none",
        });
      }

      // The mascot blinks on its own (CSS); this only runs for an SVG with
      // data-network-eyes.
      if (eyes.length > 0) {
        gsap
          .timeline({ repeat: -1, repeatDelay: 2.4, delay: 1.2 })
          .to(eyes, {
            scaleY: 0.1,
            transformOrigin: "50% 50%",
            duration: 0.08,
          })
          .to(eyes, { scaleY: 1, duration: 0.1 });
      }
    },
    { scope: scopeRef }
  );

  useGSAP(
    () => {
      const svg = scopeRef.current;
      if (!svg || !counts || !shouldSettle || hasSettledRef.current) return;
      hasSettledRef.current = true;

      const rotor = svg.querySelector("[data-network-rotor]");
      const dots = Array.from(
        svg.querySelectorAll<SVGCircleElement>("[data-network-dot]")
      );
      const lines = Array.from(
        svg.querySelectorAll<SVGLineElement>("[data-network-line]")
      );

      // Freeze the rotation and bake its angle into the dot positions, so
      // the orbits below are drawn level whatever the angle was.
      const angle = rotor ? Number(gsap.getProperty(rotor, "rotation")) : 0;
      rotationRef.current?.kill();
      if (rotor) gsap.set(rotor, { rotation: 0, svgOrigin: "0 0" });

      const radians = (angle * Math.PI) / 180;
      const positions = dots.map((dot) => {
        const x = Number(dot.getAttribute("cx"));
        const y = Number(dot.getAttribute("cy"));
        return {
          x: x * Math.cos(radians) - y * Math.sin(radians),
          y: x * Math.sin(radians) + y * Math.cos(radians),
        };
      });
      positions.forEach((point, index) => {
        gsap.set(dots[index], { attr: { cx: point.x, cy: point.y } });
        gsap.set(lines[index], { attr: { x2: point.x, y2: point.y } });
      });

      const assignments = assignDotsToOrbits(
        positions,
        allocateDots(counts, dots.length)
      );
      const instant = reduceMotion;
      const colors = groupColors();

      gsap.to(lines, { opacity: 0, duration: instant ? 0 : 0.35 });
      gsap.to("[data-network-orbit]", {
        opacity: 1,
        duration: instant ? 0 : 0.4,
      });

      assignments.forEach((assignment, order) => {
        const dot = dots[assignment.index];

        if (!assignment.group) {
          gsap.to(dot, { opacity: 0, duration: instant ? 0 : 0.3 });
          return;
        }

        gsap.to(dot, {
          attr: { cx: assignment.target.x, cy: assignment.target.y },
          fill: colors[assignment.group],
          duration: instant ? 0 : 0.62,
          ease: "power2.inOut",
          delay: instant ? 0 : (order / assignments.length) * 0.26,
        });
      });
    },
    { scope: scopeRef, dependencies: [counts, shouldSettle] }
  );
}
