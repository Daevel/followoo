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
        Open Instagram and go to your <b>profile</b> (bottom-left corner).
        <br />
        Then tap <b>Settings</b> and open <b>Accounts Center</b>.
      </>
    ),
    mediaSrc: vercelBlobStructure.videos.desktop.step01,
    mediaAlt: "Instagram settings screen",
  },
  {
    id: 2,
    title: "Find your data settings",
    description: (
      <>
        Inside <b>Accounts Center</b>:
        <br />
        <br />
        👉 Tap <b>Your information and permissions</b>
        <br />
        👉 Then select <b>Export your information</b>
      </>
    ),
    mediaSrc: vercelBlobStructure.videos.desktop.step02,
    mediaAlt: "Your information and permissions section",
  },
  {
    id: 3,
    title: "Start a new export",
    description: (
      <>
        Tap <b>Create export</b>.
        <br />
        <br />
        If you have multiple accounts:
        <br />
        👉 Select your <b>Instagram account</b>
        <br />
        <br />
        Then choose:
        <br />• <b>Export to device</b> (recommended)
        <br />• or <b>Export to external service</b>
      </>
    ),
    mediaSrc: vercelBlobStructure.videos.desktop.step03,
    mediaAlt: "Create export flow",
  },
  {
    id: 4,
    title: "Choose what to export",
    description: (
      <>
        Now customize your export:
        <br />
        <br />
        👉 Deselect everything
        <br />
        👉 Select only <b>Followers and Following</b>
        <br />
        <br />
        Then set:
        <br />
        <b>Format:</b> JSON
        <br />
        <b>Date range:</b> All time
        <br />
        <b>Media quality:</b> Any option is fine
        <br />
        <br />
        Tap <b>Save</b>, then <b>Create export</b>.
        <br />
        <br />
        💡 Don’t worry: you can’t break anything here.
      </>
    ),
    mediaSrc: vercelBlobStructure.videos.desktop.step04,
    mediaAlt: "Some of your information option",
  },
  {
    id: 5,
    title: "Download your file",
    description: (
      <>
        When Instagram notifies you:
        <br />
        <br />
        👉 Go back to <b>Accounts Center</b>
        <br />
        👉 Tap <b>Download file</b>
        <br />
        <br />
        This will download a <b>ZIP file</b> to your device.
      </>
    ),
    mediaSrc: vercelBlobStructure.videos.desktop.step05,
    mediaAlt: "Create export confirmation",
  },
  {
    id: 6,
    title: "Upload the ZIP file",
    description: (
      <>
        Click the <b>Continue</b> button in this app.
        <br />
        Then upload the ZIP file you downloaded.
        <br />
        <br />
        ⚠️ <b>Important:</b> Do NOT extract the ZIP file.
      </>
    ),
    mediaAlt: "ZIP upload inside the app",
  },
];

const mobileInstructionSteps: InstructionStep[] = [
  {
    id: 1,
    title: "Go to Export your information",
    description: (
      <>
        Open Instagram and go to your <b>profile</b> (bottom-right corner).
        <br />
        <br />
        Tap the <b>menu (☰)</b> → <b>Settings</b> → <b>Accounts Center</b>.
        <br />
        <br />
        👉 Tap <b>Your information and permissions</b>
        <br />
        👉 Tap <b>Export your information</b>
      </>
    ),
    mediaSrc: vercelBlobStructure.videos.mobile.step01,
    mediaAlt: "Navigate to export your information",
  },
  {
    id: 2,
    title: "Start the export",
    description: (
      <>
        Tap <b>Create export</b>.
        <br />
        <br />
        If you have multiple accounts:
        <br />
        👉 Select your <b>Instagram account</b>
        <br />
        <br />
        Choose how to export:
        <br />• <b>Export to device</b> (recommended)
        <br />• or <b>Export to external service</b>
      </>
    ),
    mediaSrc: vercelBlobStructure.videos.mobile.step02,
    mediaAlt: "Choose export method",
  },
  {
    id: 3,
    title: "Choose what to export",
    description: (
      <>
        Customize your export:
        <br />
        <br />
        👉 Deselect everything
        <br />
        👉 Select only <b>Followers and Following</b>
        <br />
        <br />
        Then set:
        <br />
        <b>Format:</b> JSON
        <br />
        <b>Date range:</b> All time
        <br />
        <b>Media quality:</b> Any option is fine
        <br />
        <br />
        Tap <b>Save</b>, then <b>Create export</b>.
        <br />
        <br />
        💡 Don’t worry: you can’t break anything here.
      </>
    ),
    mediaSrc: vercelBlobStructure.videos.mobile.step03,
    mediaAlt: "Customize export settings",
  },
  {
    id: 4,
    title: "Upload the ZIP file",
    description: (
      <>
        When your file is ready:
        <br />
        <br />
        👉 Download the <b>ZIP file</b>
        <br />
        👉 Upload it here
        <br />
        <br />
        ⚠️ <b>Important:</b> Do NOT extract the file.
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
  }, [src]);

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
    <div className="flex w-full max-w-3xl flex-col items-center text-left">
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
