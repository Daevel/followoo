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
import { TabButton } from "@/components/ui/TabButton";
import { vercelBlobStructure } from "@/data/vercelBlobStructure";

type DeviceType = "laptop" | "smartPhone";

type InstructionStep = {
  id: number;
  title: string;
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
    actions: [
      <>
        When Instagram notifies you, go back to{" "}
        <UiLabel>Accounts Center</UiLabel>.
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
    actions: [
      <>
        When your file is ready, download the <UiLabel>ZIP file</UiLabel>.
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

type StepListProps = {
  steps: InstructionStep[];
  currentStep: number;
  onStepClick: (stepId: number) => void;
  navigation: ReactNode;
};

// Every step on one line; the current one opens with its actions. On phones
// only the current step is shown and the navigation moves to a bottom bar.
function StepList({
  steps,
  currentStep,
  onStepClick,
  navigation,
}: StepListProps) {
  return (
    <ol className="border-line-subtle bg-surface-1 shadow-elev-1 rounded-card border p-1.5 text-start">
      {steps.map((step) => {
        const isActive = step.id === currentStep;
        const isDone = step.id < currentStep;

        const marker = (
          <span
            aria-hidden="true"
            className={clsx(
              "flex size-[26px] shrink-0 items-center justify-center rounded-full border text-xs font-semibold tabular-nums",
              isActive
                ? "border-brand bg-brand text-on-brand"
                : isDone
                  ? "border-success/30 bg-success/10 text-success"
                  : "border-line-strong text-fg-muted"
            )}
          >
            {isDone ? (
              <Icon
                name="check"
                color="current"
                width={14}
                height={14}
                aria-hidden="true"
              />
            ) : (
              step.id
            )}
          </span>
        );

        if (!isActive) {
          return (
            <li key={step.id} className="hidden lg:block">
              <button
                type="button"
                onClick={() => onStepClick(step.id)}
                className="text-fg-muted hover:text-fg focus-visible:shadow-ring flex w-full items-center gap-3 rounded-control px-3 py-2.5 text-start text-sm transition-colors outline-none"
              >
                {marker}
                <span>
                  <span className="sr-only">
                    Step {step.id}
                    {isDone ? ", done" : ""}:{" "}
                  </span>
                  {step.title}
                </span>
              </button>
            </li>
          );
        }

        return (
          <li
            key={step.id}
            aria-current="step"
            className="lg:bg-surface-2 lg:shadow-elev-1 rounded-control lg:my-1"
          >
            <div className="flex items-center gap-3 px-3 pt-3.5 pb-2.5">
              {marker}
              <h2 className="text-fg text-[17px] leading-snug font-semibold tracking-[-0.015em]">
                <span className="text-fg-muted hidden text-xs font-medium tracking-normal lg:block">
                  Step {step.id} of {steps.length}
                </span>
                {step.title}
              </h2>
            </div>

            <div className="px-3.5 pb-3.5 lg:pl-[50px]">
              <ol className="flex flex-col gap-2.5">
                {step.actions.map((action, index) => (
                  <li
                    // biome-ignore lint/suspicious/noArrayIndexKey: static, ordered content
                    key={index}
                    className="text-fg-muted flex items-baseline gap-3 text-sm leading-[1.7]"
                  >
                    <span
                      aria-hidden="true"
                      className="bg-surface-2 text-fg-muted lg:bg-surface-0 flex size-5 shrink-0 -translate-y-px items-center justify-center rounded-md text-[11px] font-semibold"
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

              <div className="mt-4 hidden justify-end lg:flex">
                {navigation}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
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

  const hasMedia = Boolean(activeStep.mediaSrc?.trim());

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
          <div ref={rootRef} className="flex-1 pb-6 lg:pb-20">
            <PageHeader
              kicker="How to start"
              title="Get your Instagram data in a few steps."
              description="Download your Instagram export, then upload the ZIP here."
              compact
              actions={
                <div
                  role="tablist"
                  aria-label="Your device"
                  className="border-line-subtle bg-surface-1 grid grid-cols-2 gap-0.5 rounded-xl border p-[3px] md:inline-grid"
                >
                  <TabButton
                    active={selectedDevice === "laptop"}
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
              className="grid items-start gap-4 lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-8"
            >
              <div className="-order-2 flex items-center justify-between lg:hidden">
                <span className="text-fg-muted text-xs font-medium">
                  Step {currentStep} of {totalSteps}
                </span>
                <StepDots total={totalSteps} current={currentStep} />
              </div>

              <div className="flex flex-col gap-3 lg:col-start-1 lg:row-start-1">
                <StepList
                  steps={instructionSteps}
                  currentStep={currentStep}
                  onStepClick={setCurrentStep}
                  navigation={<StepNavigation {...navigationProps} size="sm" />}
                />

                {currentStep < totalSteps && (
                  <div className="flex items-center justify-between gap-3 px-1">
                    <span className="text-fg-muted text-[13px]">
                      Already have the ZIP?
                    </span>
                    <Link
                      to="/get-started"
                      state={{ isDemo: false }}
                      className={buttonClasses({
                        variant: "ghost",
                        size: "sm",
                      })}
                    >
                      <Icon
                        name="upload"
                        color="current"
                        width={14}
                        height={14}
                        aria-hidden="true"
                      />
                      Upload it now
                    </Link>
                  </div>
                )}
              </div>

              {hasMedia && activeStep.mediaSrc && (
                <div className="-order-1 lg:sticky lg:top-24 lg:order-none lg:col-start-2 lg:row-start-1">
                  <StepMedia
                    key={`${selectedDevice}-${activeStep.id}`}
                    src={activeStep.mediaSrc}
                    alt={activeStep.mediaAlt}
                  />
                  <p className="text-fg-muted mt-2.5 text-xs lg:text-[13px]">
                    Instagram may take from a few minutes to a few hours to
                    prepare your file. Tap the video to pause, double tap for
                    fullscreen.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Container>

        <div className="border-line-subtle bg-surface-0/90 sticky bottom-0 z-10 border-t px-5 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
          <StepNavigation {...navigationProps} />
        </div>
      </section>
    </>
  );
}
