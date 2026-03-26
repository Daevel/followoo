import { useMemo, useRef, useState } from "react";
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
    mediaSrc: "/images/instructions/step-1.jpg",
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

function StepMedia({ src, poster }: StepMediaProps) {
  return (
    <div className="border-primary bg-primary/10 overflow-hidden rounded-3xl border">
      <div className="relative aspect-video w-full">
        <video
          src={src}
          poster={poster}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />

        {/* subtle gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />

        {/* label microvideo */}
        <div className="absolute right-4 bottom-4 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs text-white backdrop-blur-sm">
          8s demo
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
            <StepMedia src={activeStep.mediaSrc} alt={activeStep.mediaAlt} />
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
