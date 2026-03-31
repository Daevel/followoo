import { vercelBlobStructure } from "@/data/vercelBlobStructure";
import { forwardRef, useEffect, useMemo, useState } from "react";
import { Container } from "./Container";

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

export const Loading = forwardRef<HTMLDivElement, LoadingProps>(
  function Loading({ loading }, ref) {
    const [progress, setProgress] = useState(0);

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

      return safeProgress >= 100 ? "Finalizing results..." : currentStep.label;
    }, [safeProgress]);

    return (
      <section className="min-h-svh">
        <Container className="flex min-h-svh flex-col">
          <div
            ref={ref}
            data-loading-root
            className="flex flex-1 flex-col items-center justify-center pt-16 pb-6"
          >
            <div className="flex flex-col items-center text-center">
              <h2
                data-loading-title
                className="text-foreground leading-headers text-4xl font-semibold md:text-5xl"
              >
                Analyzing your data
              </h2>

              <p
                data-loading-label
                aria-live="polite"
                className="p1-r text-foreground/90 md:text-foreground mt-4 min-h-[3rem] max-w-[18rem] text-sm leading-6 md:max-w-[24rem]"
              >
                {currentLabel}
              </p>

              <div
                data-loading-bar-wrapper
                className="mt-8 w-full max-w-[320px] md:max-w-[420px]"
              >
                <div
                  role="progressbar"
                  aria-label="Loading progress"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={safeProgress}
                  className="bg-foreground/10 h-3 w-full overflow-hidden rounded-full"
                >
                  <div
                    data-loading-bar-fill
                    className="bg-primary h-full rounded-full transition-[width] duration-300 ease-out"
                    style={{ width: `${safeProgress}%` }}
                  />
                </div>

                <div
                  data-loading-progress
                  className="text-foreground/60 mt-2 text-xs"
                >
                  {safeProgress}%
                </div>
              </div>

              <div data-loading-lottie className="mt-10 flex justify-center">
                <div className="w-[180px] md:w-[220px]">
                  <img
                    src={vercelBlobStructure.images.male01}
                    alt="Loading illustration"
                    className="mx-auto w-full max-w-[220px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    );
  },
);
