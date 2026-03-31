import { vercelBlobStructure } from "@/data/vercelBlobStructure";
import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import { Container } from "../ui/Container";
import { Icon } from "../ui/Icon";
import { NavBar } from "../ui/NavBar";

type DeviceType = "laptop" | "smartPhone";

type InstructionStep = {
  id: number;
  title: string;
  description: React.ReactNode;
  mediaSrc?: string;
  mediaAlt?: string;
};

const desktopInstructionSteps: InstructionStep[] = [
  {
    id: 1,
    title: "Open Instagram Settings",
    description: (
      <>
        Open Instagram, go to your profile, then open <b>Settings</b> and enter{" "}
        <b>Accounts Center</b>.
      </>
    ),
    mediaSrc: vercelBlobStructure.videos.desktop.step01,
    mediaAlt: "Instagram settings screen",
  },
  {
    id: 2,
    title: "Open Your information and permissions",
    description: (
      <>
        Inside Accounts Center, open <b>Your information and permissions</b>,
        then choose <b>Download your information</b>.
      </>
    ),
    mediaSrc: vercelBlobStructure.videos.desktop.step02,
    mediaAlt: "Your information and permissions section",
  },
  {
    id: 3,
    title: "Choose Download or transfer information",
    description: (
      <>
        Select <b>Download or transfer information</b>, then choose your{" "}
        <b>Instagram account</b> if you have multiple Meta accounts.
      </>
    ),
    mediaSrc: vercelBlobStructure.videos.desktop.step03,
    mediaAlt: "Download or transfer information flow",
  },
  {
    id: 4,
    title: "Setup export and some of its informations",
    description: (
      <>
        Use these settings:
        <br />
        <b>Format:</b> JSON
        <br />
        <b>Date range:</b> All time
        <br />
        <b>Media quality:</b> any value is fine
        <br />
        Select only <b>Followers and Following</b> checkbox instead of exporting
        everything.
        <br />
        Press Save export and then <b>Create export</b>.
      </>
    ),
    mediaSrc: vercelBlobStructure.videos.desktop.step04,
    mediaAlt: "Some of your information option",
  },
  {
    id: 5,
    title: "Download the ZIP file from the Account Center",
    description: (
      <>
        Press <b>Download file</b>. It will download a ZIP file.
      </>
    ),
    mediaSrc: vercelBlobStructure.videos.desktop.step05,
    mediaAlt: "Create export confirmation",
  },
  {
    id: 6,
    title: "Upload the ZIP directly into this app",
    description: (
      <>
        Once downloaded, upload the <b>.zip</b> file directly here.{" "}
        <b>Do not extract it.</b>
      </>
    ),
    mediaAlt: "ZIP upload inside the app",
  },
];

const mobileInstructionSteps: InstructionStep[] = [
  {
    id: 1,
    title: "Open Instagram Settings",
    description: (
      <>
        Open Instagram, go to your profile, then open <b>Settings</b> and enter{" "}
        <b>Accounts Center</b>.
      </>
    ),
    mediaSrc: vercelBlobStructure.videos.mobile.step01,
    mediaAlt: "Instagram settings screen on mobile",
  },
  {
    id: 2,
    title: "Open Your information and permissions",
    description: (
      <>
        Inside Accounts Center, open <b>Your information and permissions</b>,
        then choose <b>Download your information</b>.
      </>
    ),
    mediaSrc: vercelBlobStructure.videos.mobile.step02,
    mediaAlt: "Your information and permissions section",
  },
  {
    id: 3,
    title: "Choose Download or transfer information",
    description: (
      <>
        Select <b>Download or transfer information</b>, then choose your{" "}
        <b>Instagram account</b> if you have multiple Meta accounts.
      </>
    ),
    mediaSrc: vercelBlobStructure.videos.mobile.step03,
    mediaAlt: "Download or transfer information flow",
  },
  {
    id: 4,
    title: "Upload the ZIP directly into this app",
    description: (
      <>
        Once downloaded, upload the <b>.zip</b> file directly here.{" "}
        <b>Do not extract it.</b>
      </>
    ),
    mediaAlt: "ZIP upload inside the app",
  },
];

type StepperProps = {
  steps: InstructionStep[];
  currentStep: number;
  onStepClick: (stepId: number) => void;
};

function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
      {steps.map((step) => {
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;

        return (
          <button
            key={step.id}
            type="button"
            onClick={() => onStepClick(step.id)}
            aria-label={`Go to step ${step.id}`}
            aria-current={isActive ? "step" : undefined}
            className={[
              "flex h-12 w-12 items-center justify-center rounded-full border text-sm font-semibold transition-all duration-200",
              isActive
                ? "border-accent bg-accent text-foreground shadow-[0_0_0_4px_rgba(255,255,255,0.04)]"
                : isCompleted
                  ? "border-primary bg-primary text-foreground"
                  : "border-foreground/40 text-foreground/80 hover:border-foreground/70 hover:text-foreground",
            ].join(" ")}
          >
            {String(step.id).padStart(2, "0")}
          </button>
        );
      })}
    </div>
  );
}

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

function StepMedia({ src, alt = "", poster }: StepMediaProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const isVideo = useMemo(() => isVideoFile(src), [src]);

  useEffect(() => {
    setDuration(0);
    setCurrentTime(0);
    setIsPlaying(true);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  }, [src]);

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
    const target = wrapperRef.current;
    if (!target) return;

    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    if (target.requestFullscreen) {
      await target.requestFullscreen();
    }
  };

  if (!isVideo) {
    return (
      <div
        ref={wrapperRef}
        className="border-primary bg-primary/10 flex items-center overflow-hidden rounded-[10px] border"
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
      className="border-primary bg-primary/10 flex items-center overflow-hidden rounded-[10px] border"
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
          onClick={togglePlayPause}
          onDoubleClick={enterFullscreen}
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
          onClick={enterFullscreen}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/45 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition hover:bg-black/60 md:top-4 md:right-4 md:left-auto md:translate-x-0 md:translate-y-0"
          aria-label="Open video in fullscreen"
        >
          Full screen
        </button>

        <div className="absolute right-4 bottom-8 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          -{formatClock(remainingTime)}
        </div>

        <div className="absolute right-0 bottom-0 left-0 px-4 pb-4">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="bg-accent h-full rounded-full transition-[width] duration-150"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

type ActiveStepContentProps = {
  step: InstructionStep;
  totalSteps: number;
};

function ActiveStepContent({ step, totalSteps }: ActiveStepContentProps) {
  return (
    <div className="w-full max-w-3xl text-left flex flex-col items-center">
      <p className="text-foreground/60 text-sm font-medium tracking-wide uppercase">
        Step {step.id} of {totalSteps}
      </p>

      <h2 className="text-foreground mt-2 text-2xl font-semibold md:text-3xl">
        {step.title}
      </h2>

      <div className="text-foreground/85 mt-4 max-w-xl text-base leading-7">
        {step.description}
      </div>
    </div>
  );
}

type DeviceStepperContentProps = {
  deviceIcon: DeviceType;
  isActive: boolean;
  onClick: () => void;
};

function DeviceStepperContent({
  deviceIcon,
  isActive,
  onClick,
}: DeviceStepperContentProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={clsx(
        "border-foreground flex h-15 w-15 items-center justify-center rounded-full border transition-all duration-200",
        isActive
          ? "bg-accent scale-105 shadow-[0_0_0_4px_rgba(255,255,255,0.04)]"
          : "bg-bg hover:border-foreground/70",
      )}
    >
      <Icon name={deviceIcon} color="foreground" width={30} height={30} />
    </button>
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
    [currentStep, instructionSteps],
  );

  const hasMedia = Boolean(activeStep.mediaSrc?.trim());

  useEffect(() => {
    setCurrentStep(1);
  }, [selectedDevice]);

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const goToNextStep = () => {
    setCurrentStep((prev) => Math.min(totalSteps, prev + 1));
  };

  return (
    <section className="flex min-h-svh flex-col">
      <NavBar />

      <Container className="flex min-h-svh max-w-5xl flex-col">
        <div
          ref={rootRef}
          className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center px-4 pt-16 pb-12 text-center md:px-6 md:pt-20"
        >
          <h1
            data-animate="hero-item"
            className="text-foreground mt-4 max-w-4xl text-4xl font-semibold md:text-6xl"
          >
            Get Started In Minutes
          </h1>

          <p
            data-animate="hero-item"
            className="text-foreground/80 mt-5 max-w-2xl text-lg leading-8"
          >
            Follow the guided tutorial step by step to download the correct ZIP
            file.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3">
            <p className="text-foreground/60 text-xs font-medium tracking-wide uppercase">
              Choose your device
            </p>

            <div className="flex flex-row gap-3">
              <DeviceStepperContent
                deviceIcon="laptop"
                isActive={selectedDevice === "laptop"}
                onClick={() => setSelectedDevice("laptop")}
              />

              <DeviceStepperContent
                deviceIcon="smartPhone"
                isActive={selectedDevice === "smartPhone"}
                onClick={() => setSelectedDevice("smartPhone")}
              />
            </div>
          </div>

          <div data-animate="hero-item" className="mt-10">
            <Stepper
              steps={instructionSteps}
              currentStep={currentStep}
              onStepClick={setCurrentStep}
            />
          </div>

          {hasMedia && activeStep.mediaSrc && (
            <>
              <div className="mt-8 w-full max-w-220">
                <StepMedia
                  key={`${selectedDevice}-${activeStep.id}`}
                  src={activeStep.mediaSrc}
                  alt={activeStep.mediaAlt}
                />
              </div>

              <p className="text-foreground/50 mt-3 text-xs">
                Tap to pause • Double tap for fullscreen
              </p>
            </>
          )}

          <div
            data-animate="hero-item"
            className="mt-8 flex w-full flex-col items-center justify-center gap-4"
          >
            <ActiveStepContent
              step={activeStep}
              totalSteps={instructionSteps.length}
            />

            <div className="mt-3 flex flex-row items-center gap-4">
              <Button
                background="primary"
                foreground="foreground"
                onClick={goToPreviousStep}
                disabled={currentStep === 1}
              >
                Back
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  background="accent"
                  foreground="foreground"
                  onClick={goToNextStep}
                >
                  Next
                </Button>
              ) : (
                <Link to="/get-started">
                  <Button background="accent" foreground="foreground">
                    Continue
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}