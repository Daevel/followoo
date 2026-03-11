import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Container } from "./Container";
import { gsap } from "gsap";

type LoadingProps = {
  loading: boolean;
};

const LOADING_STEPS = [
  { progress: 15, label: "Reading ZIP file..." },
  { progress: 35, label: "Extracting JSON files..." },
  { progress: 55, label: "Analyzing followers..." },
  { progress: 75, label: "Comparing relationships..." },
  { progress: 90, label: "Preparing results..." },
];

export function Loading({ loading }: LoadingProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-animate='hero-item']",
        {
          opacity: 0,
          y: 24,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
        },
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!loading) {
      setProgress(100);
      return;
    }

    const progressInterval = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 93) return prev;

        if (prev < 30) return prev + 6;
        if (prev < 55) return prev + 4;
        if (prev < 75) return prev + 2;
        if (prev < 90) return prev + 1;

        return prev + 0.3;
      });
    }, 160);

    return () => window.clearInterval(progressInterval);
  }, [loading]);

  const safeProgress = Math.min(100, Math.round(progress));

  const currentLabel = useMemo(() => {
    const currentStep =
      LOADING_STEPS.find((step) => safeProgress <= step.progress) ??
      LOADING_STEPS[LOADING_STEPS.length - 1];

    return safeProgress >= 100 ? "Done." : currentStep.label;
  }, [safeProgress]);

  return (
    <section className="min-h-svh">
      <Container className="min-h-svh flex flex-col">
        <div
          ref={rootRef}
          className="flex flex-1 flex-col items-center justify-center pt-16 pb-6"
        >
          <div className="flex flex-col items-center text-center">
            <h2
              data-animate="hero-item"
              className="text-4xl text-foreground font-semibold leading-headers md:text-5xl"
            >
              Loading...
            </h2>

            <p
              data-animate="hero-item"
              className="p1-r mt-4 min-h-[24px] max-w-[18rem] text-sm text-foreground/90 md:max-w-[24rem] md:text-foreground"
            >
              {currentLabel}
            </p>

            <div
              data-animate="hero-item"
              className="mt-8 w-full max-w-[320px] md:max-w-[420px]"
            >
              <div className="h-2 w-full bg-foreground/10">
                <div
                  className="h-full bg-primary transition-[width] duration-300 ease-out"
                  style={{ width: `${safeProgress}%` }}
                />
              </div>

              <div className="mt-2 text-xs text-foreground/60">
                {safeProgress}%
              </div>
            </div>

            {/* Mobile / Tablet */}
            <div data-animate="hero-item" className="w-full pt-12 lg:hidden">
              <img
                src="./images/illustration-body-male-afro-2-phone.svg"
                alt="Loading illustration"
                className="mx-auto w-full max-w-[220px]"
              />
            </div>

            {/* Desktop */}
            <div
              data-animate="hero-item"
              className="hidden w-full pt-12 lg:block"
            >
              <img
                src="./images/illustration-composition-loading-phase.svg"
                alt="Loading composition"
                className="mx-auto w-full max-w-[720px]"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}