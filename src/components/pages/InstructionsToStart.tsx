import { vercelBlobStructure } from "@/data/vercelBlobStructure";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import { Container } from "../ui/Container";
import { NavBar } from "../ui/NavBar";

type InstructionStep = {
  id: number;
  title: string;
  description: React.ReactNode;
  mediaSrc: string;
  mediaAlt: string;
};

const instructionSteps: InstructionStep[] = [
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
    mediaSrc: "/images/instructions/step-2.jpg",
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
    mediaSrc: "/images/instructions/step-3.jpg",
    mediaAlt: "Download or transfer information flow",
  },
  {
    id: 4,
    title: "Choose Some of your information",
    description: (
      <>
        Select <b>Some of your information</b> instead of exporting everything.
      </>
    ),
    mediaSrc: "/images/instructions/step-4.jpg",
    mediaAlt: "Some of your information option",
  },
  {
    id: 5,
    title: "Select Followers and following",
    description: (
      <>
        In the <b>Connections</b> section, select only{" "}
        <b>Followers and following</b>.
      </>
    ),
    mediaSrc: "/images/instructions/step-5.jpg",
    mediaAlt: "Followers and following category selected",
  },
  {
    id: 6,
    title: "Set the correct export options",
    description: (
      <>
        Use these settings:
        <br />
        <b>Format:</b> JSON
        <br />
        <b>Date range:</b> All time
        <br />
        <b>Media quality:</b> any value is fine
      </>
    ),
    mediaSrc: "/images/instructions/step-6.jpg",
    mediaAlt: "Export options configuration",
  },
  {
    id: 7,
    title: "Create the file and wait for the email",
    description: (
      <>
        Press <b>Create export</b>. Instagram will prepare the ZIP and send you
        an email when it is ready.
      </>
    ),
    mediaSrc: "/images/instructions/step-7.jpg",
    mediaAlt: "Create export confirmation",
  },
  {
    id: 8,
    title: "Upload the ZIP directly into this app",
    description: (
      <>
        Once downloaded, upload the <b>.zip</b> file directly here.{" "}
        <b>Do not extract it.</b>
      </>
    ),
    mediaSrc: "/images/instructions/step-8.jpg",
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
  alt: string;
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

function StepMedia({ src, alt, poster }: StepMediaProps) {
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
        className="border-primary bg-primary/10 overflow-hidden rounded-3xl border"
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
      className="border-primary bg-primary/10 overflow-hidden rounded-3xl border"
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
};

function ActiveStepContent({ step }: ActiveStepContentProps) {
  return (
    <div className="w-full max-w-3xl text-left">
      <p className="text-foreground/60 text-sm font-medium tracking-wide uppercase">
        Step {String(step.id).padStart(2, "0")}
      </p>

      <h2 className="text-foreground mt-2 text-2xl font-semibold md:text-3xl">
        {step.title}
      </h2>

      <div className="text-foreground/85 mt-4 max-w-2xl text-base leading-7">
        {step.description}
      </div>
    </div>
  );
}

export function InstructionsToStart() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const totalSteps = instructionSteps.length;

  const activeStep = useMemo(
    () =>
      instructionSteps.find((step) => step.id === currentStep) ??
      instructionSteps[0],
    [currentStep],
  );

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const goToNextStep = () => {
    setCurrentStep((prev) => Math.min(totalSteps, prev + 1));
  };

  return (
    <section className="flex min-h-svh flex-col">
      <NavBar />

      <Container className="flex min-h-svh flex-col">
        <div
          ref={rootRef}
          className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center px-4 pt-16 pb-12 text-center md:px-6 md:pt-20"
        >
          <p
            data-animate="hero-item"
            className="text-foreground/60 text-sm font-medium tracking-wide uppercase"
          >
            Instructions to start
          </p>

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

          <div data-animate="hero-item" className="mt-10">
            <Stepper
              steps={instructionSteps}
              currentStep={currentStep}
              onStepClick={setCurrentStep}
            />
          </div>

          <div className="mt-10 w-full max-w-4xl">
            <StepMedia
              key={activeStep.id}
              src={activeStep.mediaSrc}
              alt={activeStep.mediaAlt}
            />
          </div>

          <div className="mt-8 w-full">
            <ActiveStepContent step={activeStep} />
          </div>

          <div
            data-animate="hero-item"
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
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
      </Container>
    </section>
  );
}
