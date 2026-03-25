import { gsap } from "gsap";
import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import { Callout } from "../ui/Callout";
import { Container } from "../ui/Container";
import { NavBar } from "../ui/NavBar";

type StepCardProps = {
  step: number;
  title: string;
  description: React.ReactNode;
};

function StepCard({ step, title, description }: StepCardProps) {
  return (
    <div
      data-animate="hero-item"
      className="border-primary bg-primary/10 w-full border p-4 md:p-5"
    >
      <div className="flex items-start gap-4">
        <div className="bg-primary text-foreground flex h-8 w-8 shrink-0 items-center justify-center font-semibold">
          {step}
        </div>

        <div className="flex flex-col gap-2 text-left">
          <h3 className="text-foreground text-lg font-semibold">{title}</h3>
          <div className="text-foreground/90 text-sm leading-6">
            {description}
          </div>
        </div>
      </div>
    </div>
  );
}

export function InstructionsToStart() {
  const rootRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <section className="flex min-h-svh flex-col">
      <NavBar />
      <Container className="flex min-h-svh flex-col">
        <div
          ref={rootRef}
          className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center pt-15 pb-10 text-center"
        >
          <h1
            data-animate="hero-item"
            className="leading-headers text-foreground text-start text-4xl font-semibold md:text-5xl"
          >
            How to download your Instagram ZIP
          </h1>

          <p
            data-animate="hero-item"
            className="text-foreground/90 mt-4 max-w-2xl text-start text-base"
          >
            To analyze your profile correctly, you need the official Instagram
            export with the right options selected.
          </p>

          <div data-animate="hero-item" className="mt-8 w-full text-start">
            <Callout title="Important" variant="warning">
              Download the file in <b>JSON</b> format, set the date range to{" "}
              <b>All time</b>, and upload the ZIP exactly as downloaded. Do not
              unzip it.
            </Callout>
          </div>

          <div className="mt-10 flex w-full flex-col gap-4">
            <StepCard
              step={1}
              title="Open Instagram Settings"
              description={
                <>
                  Open Instagram, go to your profile, then open <b>Settings</b>{" "}
                  and enter <b>Accounts Center</b>. Instagram’s official help
                  routes data export through Accounts Center.
                </>
              }
            />

            <StepCard
              step={2}
              title="Open Your information and permissions"
              description={
                <>
                  Inside Accounts Center, open{" "}
                  <b>Your information and permissions</b>, then choose{" "}
                  <b>Download your information</b>. This is the official export
                </>
              }
            />

            <StepCard
              step={3}
              title="Choose Download or transfer information"
              description={
                <>
                  Select <b>Download or transfer information</b>, then choose
                  your <b>Instagram account</b> if multiple Meta accounts are
                </>
              }
            />

            <StepCard
              step={4}
              title="Choose Some of your information"
              description={
                <>
                  Select <b>Some of your information</b> rather than exporting
                  everything. Instagram officially lets you choose either all
                  available information or only specific categories.
                </>
              }
            />

            <StepCard
              step={5}
              title="Select Followers and following"
              description={
                <>
                  In the <b>Connections</b> section, select only{" "}
                  <b>Followers and following</b>. This is the only category your
                  app needs. Third-party walkthroughs that follow the official
                  flow describe this exact selection.
                </>
              }
            />

            <StepCard
              step={6}
              title="Set the correct export options"
              description={
                <>
                  Use these settings:
                  <br />
                  <b>Format:</b> JSON
                  <br />
                  <b>Date range:</b> All time
                  <br />
                  <b>Media quality:</b> any value is fine
                  <br />
                  JSON is required for your parser, and Instagram supports
                  choosing the export format and time range.
                </>
              }
            />

            <StepCard
              step={7}
              title="Create the file and wait for the email"
              description={
                <>
                  Press <b>Create export</b> or the equivalent confirmation
                  button. Instagram will prepare the ZIP and send you an email
                  when it is ready to download. Official and secondary guides
                  describe this final export step.
                </>
              }
            />

            <StepCard
              step={8}
              title="Upload the ZIP directly into this app"
              description={
                <>
                  Once downloaded, upload the <b>.zip</b> file directly here.
                  <b> Do not extract it.</b>
                </>
              }
            />
          </div>

          <div data-animate="hero-item" className="mt-10 w-full">
            <Callout title="Expected ZIP structure" variant="info">
              <div className="text-left font-mono text-sm leading-6">
                connections/
                <br />
                └── followers_and_following/
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;├── followers_1.json
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;├── following.json
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;├── recently_unfollowed_profiles.json
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;└── blocked_profiles.json
              </div>
            </Callout>
          </div>

          <div
            data-animate="hero-item"
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link to="/get-started">
              <Button
                background="accent"
                foreground="foreground"
                icon="arrowRight"
                iconPosition="right"
              >
                I have the ZIP
              </Button>
            </Link>

            <Link to="/">
              <Button background="primary" foreground="foreground">
                Back home
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
