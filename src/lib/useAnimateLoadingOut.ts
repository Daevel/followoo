import { gsap } from "gsap";

export function animateLoadingOut(root: HTMLDivElement) {
  return new Promise<void>((resolve) => {
    const title = root.querySelector("[data-loading-title]");
    const label = root.querySelector("[data-loading-label]");
    const progressText = root.querySelector("[data-loading-progress]");
    const barFill = root.querySelector("[data-loading-bar-fill]");
    const barWrapper = root.querySelector("[data-loading-bar-wrapper]");
    const img = root.querySelector("[data-loading-img]");

    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      onComplete: resolve,
    });

    tl.to(barFill, {
      width: "100%",
      duration: 0.35,
    })
      .to(
        label,
        {
          opacity: 1,
          y: 0,
          duration: 0.15,
        },
        0,
      )
      .to(
        [title, label, progressText],
        {
          y: -10,
          opacity: 0,
          duration: 0.28,
          stagger: 0.03,
        },
        0.08,
      )
      .to(
        barWrapper,
        {
          opacity: 0,
          y: -8,
          duration: 0.28,
        },
        0.12,
      )
      .to(
        img,
        {
          opacity: 0,
          scale: 0.96,
          duration: 0.3,
        },
        0.1,
      )
      .to(
        root,
        {
          opacity: 0,
          filter: "blur(6px)",
          duration: 0.35,
        },
        0.18,
      );
  });
}
