import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// "Reduce motion" for every GSAP animation at once: the global timeline
// runs so fast that each tween lands on its final state at once, while
// callbacks (e.g. a toast's close) still fire. Endless loops must still
// check the preference themselves and not start.
if (typeof window !== "undefined" && window.matchMedia) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const apply = () =>
    gsap.globalTimeline.timeScale(reduceMotion.matches ? 1000 : 1);
  apply();
  reduceMotion.addEventListener?.("change", apply);
}

export { gsap, ScrollTrigger, useGSAP };
