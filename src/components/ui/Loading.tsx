import clsx from "clsx";
import { forwardRef, useEffect, useMemo, useState } from "react";
import { Container } from "./Container";
import { Icon } from "./Icon";

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
            <div className="border-line-subtle bg-surface-1 shadow-elev-1 flex w-full max-w-md flex-col gap-4 rounded-card border p-6">
              <p className="text-fg-muted flex flex-wrap items-center gap-x-1.5 text-xs font-medium">
                Analysis in progress ·
                <span className="text-success inline-flex items-center gap-1">
                  <Icon
                    name="lock"
                    color="current"
                    width={12}
                    height={12}
                    aria-hidden="true"
                  />
                  Only in your browser
                </span>
              </p>

              <div className="flex items-baseline justify-between gap-4">
                {/* `!`: the global unlayered h2 size in index.css beats utilities */}
                <h2
                  data-loading-title
                  className="text-fg text-xl! leading-tight font-semibold tracking-[-0.02em]"
                >
                  Analyzing your data
                </h2>
                <span
                  data-loading-progress
                  className="text-fg text-xl font-semibold tabular-nums"
                >
                  {safeProgress}%
                </span>
              </div>

              <div data-loading-bar-wrapper>
                <div
                  role="progressbar"
                  aria-label="Loading progress"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={safeProgress}
                  className="bg-surface-2 h-1.5 w-full overflow-hidden rounded-full"
                >
                  <div
                    data-loading-bar-fill
                    className="bg-brand-fg h-full rounded-full transition-[width] duration-300 ease-out"
                    style={{ width: `${safeProgress}%` }}
                  />
                </div>
              </div>

              <p data-loading-label aria-live="polite" className="sr-only">
                {currentLabel}
              </p>

              <ul className="flex flex-col gap-2.5 text-[13px]">
                {LOADING_STEPS.map((step, index) => {
                  const isDone =
                    safeProgress >= 100 || safeProgress > step.progress;
                  const isCurrent =
                    !isDone &&
                    (index === 0 ||
                      safeProgress > LOADING_STEPS[index - 1].progress);

                  return (
                    <li
                      key={step.label}
                      className={clsx(
                        "flex items-center gap-2.5",
                        isDone && "text-fg-muted",
                        isCurrent && "text-fg font-medium",
                        !isDone && !isCurrent && "text-fg-faint"
                      )}
                    >
                      {isDone ? (
                        <Icon
                          name="check"
                          color="current"
                          width={14}
                          height={14}
                          className="text-success shrink-0"
                          aria-hidden="true"
                        />
                      ) : isCurrent ? (
                        <span
                          aria-hidden="true"
                          className="border-surface-2 border-t-brand-fg size-3.5 shrink-0 animate-spin rounded-full border-[1.5px]"
                        />
                      ) : (
                        <span
                          aria-hidden="true"
                          className="size-3.5 shrink-0 rounded-full border-[1.5px] border-current"
                        />
                      )}
                      {step.label.replace(/\.\.\.$/, "")}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Container>
      </section>
    );
  }
);
