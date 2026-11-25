import clsx from "clsx";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { useStandardPageAnimation } from "@/animations/pages/useStandardPageAnimation";
import { Button, buttonClasses } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { NavBar } from "@/components/ui/NavBar";
import { PageHeader } from "@/components/ui/PageHeader";
import Seo from "@/components/ui/Seo";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { TabButton } from "@/components/ui/TabButton";
import { TabIndicator } from "@/components/ui/TabIndicator";
import { vercelBlobStructure } from "@/data/vercelBlobStructure";

type DeviceType = "laptop" | "smartPhone";

type InstructionStep = {
  id: number;
  title: string;
  /** Label in the desktop progress bar, where six steps share one row. */
  shortTitle: string;
  /** One action per item, in order. */
  actions: ReactNode[];
  /** Reassurance shown after the actions. */
  note?: string;
  /** Show the "don't extract the ZIP" warning (download and upload steps). */
  zipWarning?: boolean;
  mediaSrc?: string;
  mediaAlt?: string;
};

// The name of a button or menu as it appears in Instagram, so it can be
// spotted on screen.
function UiLabel({ children }: { children: ReactNode }) {
  return (
    <span className="border-line-subtle bg-surface-2 text-fg rounded-md border px-1.5 py-px text-[13px] font-medium whitespace-nowrap">
      {children}
    </span>
  );
}

const desktopInstructionSteps: InstructionStep[] = [
  {
    id: 1,
    title: "Open Instagram Settings",
    shortTitle: "Open Settings",
    actions: [
      <>
        Open Instagram and go to your <UiLabel>Profile</UiLabel> (bottom-left
        corner).
      </>,
      <>
        Tap <UiLabel>Settings</UiLabel> and open{" "}
        <UiLabel>Accounts Center</UiLabel>.
      </>,
    ],
    mediaSrc: vercelBlobStructure.videos.desktop.step01,
    mediaAlt: "Instagram settings screen",
  },
  {
    id: 2,
    title: "Find your data settings",
    shortTitle: "Find data settings",
    actions: [
      <>
        Inside <UiLabel>Accounts Center</UiLabel>, tap{" "}
        <UiLabel>Your information and permissions</UiLabel>.
      </>,
      <>
        Then select <UiLabel>Export your information</UiLabel>.
      </>,
    ],
    mediaSrc: vercelBlobStructure.videos.desktop.step02,
    mediaAlt: "Your information and permissions section",
  },
  {
    id: 3,
    title: "Start a new export",
    shortTitle: "Start an export",
    actions: [
      <>
        Tap <UiLabel>Create export</UiLabel>.
      </>,
      <>
        If you have multiple accounts, select your{" "}
        <UiLabel>Instagram account</UiLabel>.
      </>,
      <>
        Choose <UiLabel>Export to device</UiLabel> (recommended) or{" "}
        <UiLabel>Export to external service</UiLabel>.
      </>,
    ],
    mediaSrc: vercelBlobStructure.videos.desktop.step03,
    mediaAlt: "Create export flow",
  },
  {
    id: 4,
    title: "Choose what to export",
    shortTitle: "Choose what to export",
    actions: [
      <>
        Deselect everything, then select only{" "}
        <UiLabel>Followers and following</UiLabel>.
      </>,
      <>
        Set <UiLabel>Format: JSON</UiLabel> and{" "}
        <UiLabel>Date range: All time</UiLabel>. Any media quality is fine.
      </>,
      <>
        Tap <UiLabel>Save</UiLabel>, then <UiLabel>Create export</UiLabel>.
      </>,
    ],
    note: "Don't worry: you can't break anything here.",
    mediaSrc: vercelBlobStructure.videos.desktop.step04,
    mediaAlt: "Some of your information option",
  },
  {
    id: 5,
    title: "Download your file",
    shortTitle: "Download",
    actions: [
      <>
        When Instagram notifies you (it can take from a few minutes to a few
        hours), go back to <UiLabel>Accounts Center</UiLabel>.
      </>,
      <>
        Tap <UiLabel>Download file</UiLabel>: a ZIP file is saved to your
        device.
      </>,
    ],
    zipWarning: true,
    mediaSrc: vercelBlobStructure.videos.desktop.step05,
    mediaAlt: "Create export confirmation",
  },
  {
    id: 6,
    title: "Upload the ZIP file",
    shortTitle: "Upload",
    actions: [
      <>
        Click <UiLabel>Continue</UiLabel> below.
      </>,
      "Upload the ZIP file you downloaded.",
    ],
    zipWarning: true,
    mediaAlt: "ZIP upload inside the app",
  },
];

const mobileInstructionSteps: InstructionStep[] = [
  {
    id: 1,
    title: "Go to Export your information",
    shortTitle: "Export your information",
    actions: [
      <>
        Open Instagram and go to your <UiLabel>Profile</UiLabel> (bottom-right
        corner).
      </>,
      <>
        Tap the menu <UiLabel>☰</UiLabel>, then <UiLabel>Settings</UiLabel> and{" "}
        <UiLabel>Accounts Center</UiLabel>.
      </>,
      <>
        Tap <UiLabel>Your information and permissions</UiLabel>, then{" "}
        <UiLabel>Export your information</UiLabel>.
      </>,
    ],
    mediaSrc: vercelBlobStructure.videos.mobile.step01,
    mediaAlt: "Navigate to export your information",
  },
  {
    id: 2,
    title: "Start the export",
    shortTitle: "Start the export",
    actions: [
      <>
        Tap <UiLabel>Create export</UiLabel>.
      </>,
      <>
        If you have multiple accounts, select your{" "}
        <UiLabel>Instagram account</UiLabel>.
      </>,
      <>
        Choose <UiLabel>Export to device</UiLabel> (recommended) or{" "}
        <UiLabel>Export to external service</UiLabel>.
      </>,
    ],
    mediaSrc: vercelBlobStructure.videos.mobile.step02,
    mediaAlt: "Choose export method",
  },
  {
    id: 3,
    title: "Choose what to export",
    shortTitle: "Choose what to export",
    actions: [
      <>
        Deselect everything, then select only{" "}
        <UiLabel>Followers and following</UiLabel>.
      </>,
      <>
        Set <UiLabel>Format: JSON</UiLabel> and{" "}
        <UiLabel>Date range: All time</UiLabel>. Any media quality is fine.
      </>,
      <>
        Tap <UiLabel>Save</UiLabel>, then <UiLabel>Create export</UiLabel>.
      </>,
    ],
    note: "Don't worry: you can't break anything here.",
    mediaSrc: vercelBlobStructure.videos.mobile.step03,
    mediaAlt: "Customize export settings",
  },
  {
    id: 4,
    title: "Upload the ZIP file",
    shortTitle: "Upload",
    actions: [
      <>
        When your file is ready (it can take from a few minutes to a few hours),
        download the <UiLabel>ZIP file</UiLabel>.
      </>,
      <>
        Tap <UiLabel>Continue</UiLabel> below and upload it.
      </>,
    ],
    zipWarning: true,
    mediaAlt: "ZIP upload inside the app",
  },
];

type StepMediaProps = {
  src: string;
  alt?: string;
  poster?: string;
};

function isVideoFile(src: string) {
  return /\.(mp4|webm|ogg)$/i.test(src);
}

function formatClock(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";

  const totalSeconds = Math.ceil(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

type HTMLVideoElementWithWebkitFullscreen = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void;
};

export function StepMedia({ src, alt = "", poster }: StepMediaProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastTapRef = useRef(0);
  const singleTapTimeoutRef = useRef<number | null>(null);

  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const isVideo = useMemo(() => isVideoFile(src), [src]);

  useEffect(() => {
    let abortController: AbortController | null = null;

    const runEffect = async () => {
      setDuration(0);
      setCurrentTime(0);
      setIsPlaying(true);
      lastTapRef.current = 0;

      if (singleTapTimeoutRef.current) {
        window.clearTimeout(singleTapTimeoutRef.current);
        singleTapTimeoutRef.current = null;
      }

      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
    };

    void runEffect();
    abortController = new AbortController();

    return () => {
      abortController?.abort();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (singleTapTimeoutRef.current) {
        window.clearTimeout(singleTapTimeoutRef.current);
      }
    };
  }, []);

  const progressPercentage =
    duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;

  const remainingTime = Math.max(duration - currentTime, 0);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      void video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const enterFullscreen = async () => {
    const wrapper = wrapperRef.current;
    const video = videoRef.current;

    if (!video) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return;
      }

      if (video.requestFullscreen) {
        await video.requestFullscreen();
        return;
      }

      if (wrapper?.requestFullscreen) {
        await wrapper.requestFullscreen();
        return;
      }

      const safariVideo = video as HTMLVideoElementWithWebkitFullscreen;

      if (typeof safariVideo.webkitEnterFullscreen === "function") {
        safariVideo.webkitEnterFullscreen();
      }
    } catch (error) {
      console.error("Failed to toggle fullscreen:", error);
    }
  };

  const handleVideoTap = () => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current;
    const doubleTapDelay = 280;

    if (timeSinceLastTap > 0 && timeSinceLastTap < doubleTapDelay) {
      if (singleTapTimeoutRef.current) {
        window.clearTimeout(singleTapTimeoutRef.current);
        singleTapTimeoutRef.current = null;
      }

      lastTapRef.current = 0;
      void enterFullscreen();
      return;
    }

    lastTapRef.current = now;

    singleTapTimeoutRef.current = window.setTimeout(() => {
      togglePlayPause();
      singleTapTimeoutRef.current = null;
    }, doubleTapDelay);
  };

  if (!isVideo) {
    return (
      <div
        ref={wrapperRef}
        className="border-line-subtle bg-surface-1 shadow-elev-1 flex items-center overflow-hidden rounded-card border"
      >
        <div className="relative aspect-video w-full">
          <img src={src} alt={alt} className="h-full w-full object-cover" />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className="border-line-subtle bg-surface-1 shadow-elev-1 flex items-center overflow-hidden rounded-card border"
    >
      <div className="group relative aspect-video w-full">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          preload="metadata"
          className="h-full w-full cursor-pointer object-cover"
          autoPlay
          muted
          playsInline
          onClick={handleVideoTap}
          onLoadedMetadata={(event) => {
            const video = event.currentTarget;
            setDuration(video.duration);
          }}
          onTimeUpdate={(event) => {
            setCurrentTime(event.currentTarget.currentTime);
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={(event) => {
            const video = event.currentTarget;
            video.currentTime = 0;
            void video.play();
            setCurrentTime(0);
            setIsPlaying(true);
          }}
        />

        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent" />

        {!isPlaying && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-black/45 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              Paused
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => void enterFullscreen()}
          className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/45 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition hover:bg-black/60 md:top-4 md:right-4 md:left-auto md:translate-x-0 md:translate-y-0"
          aria-label="Open video in fullscreen"
        >
          Fullscreen
        </button>

        <div className="pointer-events-none absolute right-4 bottom-8 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          -{formatClock(remainingTime)}
        </div>

        <div className="pointer-events-none absolute right-0 bottom-0 left-0 px-4 pb-4">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="bg-brand-fg h-full rounded-full transition-[width] duration-150"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ZipWarning() {
  return (
    <Callout variant="warning" title="Don't extract the ZIP">
      Upload the file exactly as Instagram sends it.
    </Callout>
  );
}

type StepNavigationProps = {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  size?: "sm" | "md";
  className?: string;
};

function StepNavigation({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  size = "md",
  className,
}: StepNavigationProps) {
  return (
    <div className={clsx("flex gap-2", className)}>
      <Button
        variant="secondary"
        size={size}
        icon="arrowLeft"
        onClick={onBack}
        disabled={currentStep === 1}
        className="flex-1 lg:flex-none"
      >
        Back
      </Button>

      {currentStep < totalSteps ? (
        <Button
          size={size}
          icon="arrowRight"
          iconPosition="right"
          onClick={onNext}
          className="flex-1 lg:flex-none"
        >
          Next
        </Button>
      ) : (
        <Link
          to="/get-started"
          state={{ isDemo: false }}
          className={clsx(
            buttonClasses({ variant: "primary", size }),
            "flex-1 lg:flex-none"
          )}
        >
          Continue
          <Icon
            name="arrowRight"
            color="current"
            width={16}
            height={16}
            aria-hidden="true"
          />
        </Link>
      )}
    </div>
  );
}

type StepState = "done" | "active" | "upcoming";

function stepState(stepId: number, currentStep: number): StepState {
  if (stepId === currentStep) return "active";
  return stepId < currentStep ? "done" : "upcoming";
}

function StepMarker({ id, state }: { id: number; state: StepState }) {
  return (
    <span
      aria-hidden="true"
      className={clsx(
        "flex size-[26px] shrink-0 items-center justify-center rounded-full border text-xs font-semibold tabular-nums",
        state === "active" && "border-brand bg-brand text-on-brand",
        state === "done" && "border-success/30 bg-success/10 text-success",
        state === "upcoming" && "border-line-strong text-fg-muted"
      )}
    >
      {state === "done" ? (
        <Icon
          name="check"
          color="current"
          width={14}
          height={14}
          aria-hidden="true"
        />
      ) : (
        id
      )}
    </span>
  );
}

type StepProgressProps = {
  steps: InstructionStep[];
  currentStep: number;
  onStepClick: (stepId: number) => void;
};

// Desktop only: every step on one row, so the page shows where you are
// without a list that grows taller than the video next to it.
function StepProgress({ steps, currentStep, onStepClick }: StepProgressProps) {
  return (
    <ol aria-label="Steps" className="hidden items-center lg:flex">
      {steps.map((step, index) => {
        const state = stepState(step.id, currentStep);
        const isLast = index === steps.length - 1;

        return (
          <li
            key={step.id}
            className={clsx("flex items-center", !isLast && "flex-1")}
          >
            <button
              type="button"
              onClick={() => onStepClick(step.id)}
              aria-current={state === "active" ? "step" : undefined}
              className={clsx(
                "focus-visible:shadow-ring flex shrink-0 items-center gap-2.5 rounded-control py-1 pr-1.5 text-[13px] whitespace-nowrap transition-colors outline-none",
                state === "active"
                  ? "text-fg font-semibold"
                  : "text-fg-muted hover:text-fg"
              )}
            >
              <StepMarker id={step.id} state={state} />
              <span>
                <span className="sr-only">
                  Step {step.id}
                  {state === "done" ? ", done" : ""}:{" "}
                </span>
                {step.shortTitle}
              </span>
            </button>
            {!isLast && (
              <span
                aria-hidden="true"
                className={clsx(
                  "mx-2.5 h-px min-w-4 flex-1",
                  state === "done" ? "bg-success/35" : "bg-line-strong"
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function StepContent({
  step,
  totalSteps,
}: {
  step: InstructionStep;
  totalSteps: number;
}) {
  return (
    <>
      <div className="flex items-center gap-3">
        <span className="lg:hidden">
          <StepMarker id={step.id} state="active" />
        </span>
        <h2 className="text-fg text-[17px] leading-snug font-semibold tracking-[-0.015em] lg:text-xl">
          <span className="text-fg-muted hidden text-xs font-medium tracking-normal lg:mb-0.5 lg:block">
            Step {step.id} of {totalSteps}
          </span>
          {step.title}
        </h2>
      </div>

      <ol className="mt-3.5 flex flex-col gap-2.5 lg:mt-4">
        {step.actions.map((action, index) => (
          <li
            // biome-ignore lint/suspicious/noArrayIndexKey: static, ordered content
            key={index}
            className="text-fg-muted flex items-baseline gap-3 text-sm leading-[1.7]"
          >
            <span
              aria-hidden="true"
              className="bg-surface-2 text-fg-muted flex size-5 shrink-0 -translate-y-px items-center justify-center rounded-md text-[11px] font-semibold"
            >
              {index + 1}
            </span>
            <span>{action}</span>
          </li>
        ))}
      </ol>

      {step.note && (
        <p className="text-fg-muted mt-3 text-[13px]">{step.note}</p>
      )}

      {step.zipWarning && (
        <div className="mt-4">
          <ZipWarning />
        </div>
      )}
    </>
  );
}

// Fills the video slot on the last step, so the card keeps its shape.
function UploadPreview() {
  return (
    <div className="border-line-strong flex aspect-video flex-col items-center justify-center gap-2 rounded-card border border-dashed px-8 text-center">
      <span className="bg-surface-2 text-brand-fg mb-1 flex size-11 items-center justify-center rounded-full">
        <Icon
          name="upload"
          color="current"
          width={20}
          height={20}
          aria-hidden="true"
        />
      </span>
      <p className="text-fg text-[15px] font-semibold">
        Your ZIP goes here next
      </p>
      <p className="text-fg-muted max-w-[320px] text-[13px]">
        Followoo reads it right on this device.
      </p>
    </div>
  );
}

function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <div aria-hidden="true" className="flex gap-1.5">
      {Array.from({ length: total }, (_, index) => {
        const id = index + 1;
        return (
          <span
            key={id}
            className={clsx(
              "h-1 w-5 rounded-full",
              id === current
                ? "bg-brand-fg"
                : id < current
                  ? "bg-success/50"
                  : "bg-surface-2"
            )}
          />
        );
      })}
    </div>
  );
}

export function InstructionsToStart() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const deviceTabsRef = useRef<HTMLDivElement | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>("laptop");

  const instructionSteps = useMemo(() => {
    return selectedDevice === "laptop"
      ? desktopInstructionSteps
      : mobileInstructionSteps;
  }, [selectedDevice]);

  const totalSteps = instructionSteps.length;

  const activeStep = useMemo(
    () =>
      instructionSteps.find((step) => step.id === currentStep) ??
      instructionSteps[0],
    [currentStep, instructionSteps]
  );

  const mediaSrc = activeStep.mediaSrc?.trim();
  const isLastStep = currentStep === totalSteps;

  useStandardPageAnimation(rootRef);

  // The two guides have a different number of steps: start over on switch.
  const selectDevice = (device: DeviceType) => {
    setSelectedDevice(device);
    setCurrentStep(1);
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const goToNextStep = () => {
    setCurrentStep((prev) => Math.min(totalSteps, prev + 1));
  };

  const uploadShortcut = (
    <Link
      to="/get-started"
      state={{ isDemo: false }}
      className="text-fg-muted hover:text-fg focus-visible:shadow-ring rounded-control text-[13px] outline-none"
    >
      Already have the ZIP?{" "}
      <span className="text-brand-fg font-medium">Upload it now</span>
    </Link>
  );

  const navigationProps = {
    currentStep,
    totalSteps,
    onBack: goToPreviousStep,
    onNext: goToNextStep,
  };

  return (
    <>
      <Seo
        title="How to Download Instagram Followers Export - Followoo"
        description="Step-by-step instructions to download your official Instagram followers and following export from Meta Accounts Center in JSON format."
        image="https://followoo.app/icons/OG.png"
        canonical="https://followoo.app/instructions-to-start"
      />
      <section className="flex min-h-svh flex-col">
        <NavBar />

        <Container size="app" className="flex flex-1 flex-col">
          <div ref={rootRef} className="flex-1 pb-6 lg:pb-12">
            <PageHeader
              kicker="How to start"
              title="Get your Instagram data in a few steps."
              description="Download your Instagram export, then upload the ZIP here."
              compact
              actions={
                <div
                  ref={deviceTabsRef}
                  role="tablist"
                  aria-label="Your device"
                  className="border-line-subtle bg-surface-1 relative grid grid-cols-2 gap-0.5 rounded-xl border p-[3px] md:inline-grid"
                >
                  <TabIndicator
                    containerRef={deviceTabsRef}
                    activeKey={selectedDevice}
                  />
                  <TabButton
                    active={selectedDevice === "laptop"}
                    withIndicator
                    onClick={() => selectDevice("laptop")}
                  >
                    <Icon
                      name="laptop"
                      color="current"
                      width={14}
                      height={14}
                      aria-hidden="true"
                    />
                    Computer
                  </TabButton>
                  <TabButton
                    active={selectedDevice === "smartPhone"}
                    withIndicator
                    onClick={() => selectDevice("smartPhone")}
                  >
                    <Icon
                      name="smartPhone"
                      color="current"
                      width={14}
                      height={14}
                      aria-hidden="true"
                    />
                    Phone
                  </TabButton>
                </div>
              }
            />

            <div
              data-page-animate="content"
              className="flex flex-col gap-4 lg:gap-5"
            >
              <div className="flex items-center justify-between lg:hidden">
                <span className="text-fg-muted text-xs font-medium">
                  Step {currentStep} of {totalSteps}
                </span>
                <StepDots total={totalSteps} current={currentStep} />
              </div>

              <StepProgress
                steps={instructionSteps}
                currentStep={currentStep}
                onStepClick={setCurrentStep}
              />

              {/* One card on desktop: what to do next to the video, then the
                  navigation. Nothing to line up, whatever the step's length.
                  The video column also shrinks with the window height, so
                  the whole step fits on a laptop screen without scrolling. */}
              <div className="lg:border-line-subtle lg:bg-surface-1 lg:shadow-elev-1 lg:rounded-card [--stage-offset:420px] lg:border">
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_min(56%,max(380px,calc((100svh-var(--stage-offset))*16/9)))] lg:gap-7 lg:p-2.5">
                  <div className="border-line-subtle bg-surface-1 shadow-elev-1 rounded-card order-2 border p-4 text-start lg:order-1 lg:border-0 lg:bg-transparent lg:pt-4 lg:pr-0 lg:pb-2 lg:pl-4 lg:shadow-none">
                    <StepContent step={activeStep} totalSteps={totalSteps} />
                  </div>

                  <div
                    className={clsx(
                      "order-1 lg:order-2",
                      !mediaSrc && "hidden lg:block"
                    )}
                  >
                    {mediaSrc ? (
                      <StepMedia
                        key={`${selectedDevice}-${activeStep.id}`}
                        src={mediaSrc}
                        alt={activeStep.mediaAlt}
                      />
                    ) : (
                      <UploadPreview />
                    )}
                  </div>
                </div>

                <div className="border-line-subtle mx-2.5 hidden items-center justify-between gap-4 border-t py-3 pr-1.5 pl-4 lg:flex">
                  {isLastStep ? <span /> : uploadShortcut}
                  <StepNavigation {...navigationProps} size="sm" />
                </div>
              </div>

              {!isLastStep && <div className="lg:hidden">{uploadShortcut}</div>}
            </div>
          </div>
        </Container>
        <SiteFooter />

        <div className="border-line-subtle bg-surface-0/90 sticky bottom-0 z-10 border-t px-5 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
          <StepNavigation {...navigationProps} />
        </div>
      </section>
    </>
  );
}
