import { SignInButton } from "@clerk/react";
import { useRef } from "react";
import { Link } from "react-router";
import { useStandardPageAnimation } from "@/animations/pages/useStandardPageAnimation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Checkbox } from "@/components/ui/Checkbox";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Loading } from "@/components/ui/Loading";
import { NavBar } from "@/components/ui/NavBar";
import { ZipDropzone } from "@/components/ui/ZipDropzone";
import { useInstagramExportAnalysis } from "../hooks/useInstagramExportAnalysis";

type InstagramExportUploadExperienceProps = {
  isDemo: boolean;
};

export function InstagramExportUploadExperience({
  isDemo,
}: InstagramExportUploadExperienceProps) {
  const {
    selectedZipFile,
    setSelectedZipFile,
    uploadError,
    setUploadError,
    loading,
    loadingRef,
    setTermsAndConditionsAccepted,
    fileValidationState,
    setFileValidationState,
    fileValidationMessage,
    setFileValidationMessage,
    isTermsAccepted,
    hasValidFile,
    onElaborateFile,
    needsAccountPrompt,
  } = useInstagramExportAnalysis({ isDemo });

  const rootRef = useRef<HTMLDivElement | null>(null);

  useStandardPageAnimation(rootRef);

  if (loading) {
    return <Loading ref={loadingRef} loading={loading} />;
  }

  if (needsAccountPrompt) {
    return (
      <section className="flex min-h-svh flex-col">
        <NavBar />

        <Container className="flex min-h-svh flex-col">
          <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-stretch justify-center gap-5 py-16 text-start">
            <h1 className="text-fg text-[28px] leading-tight font-semibold tracking-[-0.025em]">
              Create a free account to continue
            </h1>

            <Callout title="Your first analysis was free" variant="info">
              Signing in takes a few seconds and stays completely free - it just
              lets us know it&apos;s you. Your Instagram data is still never
              uploaded or stored anywhere.
            </Callout>

            <SignInButton mode="modal">
              <Button size="lg" className="w-full">
                Sign in or create a free account
              </Button>
            </SignInButton>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="flex min-h-svh flex-col">
      <NavBar />

      <Container size="app" className="flex min-h-svh flex-col">
        <div
          ref={rootRef}
          className="grid w-full flex-1 grid-cols-1 content-start items-start gap-8 pt-10 pb-12 text-start md:pt-14 lg:grid-cols-[minmax(0,1fr)_480px] lg:gap-x-14 lg:gap-y-8"
        >
          {/* Order: intro, upload card, details. On phones the action comes
              right after the title; on desktop the card spans the right column. */}
          <div className="flex min-w-0 flex-col lg:col-start-1 lg:row-start-1">
            <div data-page-animate="heading">
              <Badge
                tone="brand"
                icon={
                  <Icon
                    name="shield"
                    color="current"
                    width={12}
                    height={12}
                    aria-hidden="true"
                  />
                }
              >
                Private by default
              </Badge>
              <h1 className="text-fg mt-4 text-[32px] leading-[1.1] font-semibold tracking-[-0.03em] sm:text-[40px]">
                Upload your Instagram ZIP
              </h1>
            </div>

            <p
              data-page-animate="subheading"
              className="text-fg-muted mt-4 max-w-xl text-base leading-7"
            >
              Your export will be analyzed directly in your browser. Nothing is
              uploaded to external servers.
            </p>
          </div>

          <div
            data-page-animate="content"
            className="border-line-subtle bg-surface-1 shadow-elev-1 flex min-w-0 flex-col gap-4 rounded-card border p-5 sm:p-6 lg:col-start-2 lg:row-span-2 lg:row-start-1"
          >
            <h2 className="text-fg text-base font-semibold">
              {isDemo ? "Try the demo" : "Current export"}
            </h2>

            {isDemo && (
              <div data-page-animate="callout">
                <Callout title="Demo mode" variant="info">
                  A sample Instagram export will be used automatically to show
                  how the analysis works.
                </Callout>
              </div>
            )}

            {!isDemo && (
              <div data-page-animate="item" className="w-full">
                <ZipDropzone
                  file={selectedZipFile}
                  onFileChange={setSelectedZipFile}
                  onError={(errorMessage) => {
                    setUploadError(errorMessage);
                    setFileValidationState("invalid");
                    setFileValidationMessage(errorMessage);
                  }}
                />
              </div>
            )}

            {!isDemo && !selectedZipFile && !uploadError && (
              <p data-page-animate="item" className="text-fg-muted text-[13px]">
                No file selected yet. Only <b className="text-fg">.zip</b> files
                are supported.
              </p>
            )}

            {!isDemo && fileValidationState === "checking" && (
              <div data-page-animate="item" className="w-full">
                <Callout title="Checking file" variant="info">
                  Verifying the ZIP structure...
                </Callout>
              </div>
            )}

            {!isDemo && fileValidationState === "valid" && (
              <div data-page-animate="item" className="w-full">
                <Callout title="File verified" variant="success">
                  {fileValidationMessage}
                </Callout>
              </div>
            )}

            {/* A rejected drop only sets uploadError, so it must show here too:
                a blocking error is never left to the transient toast alone. */}
            {!isDemo &&
              (fileValidationState === "invalid" || uploadError) &&
              (fileValidationMessage || uploadError) && (
                <div data-page-animate="item" className="w-full">
                  <Callout title="Invalid file" variant="danger">
                    {fileValidationMessage || uploadError}
                  </Callout>
                </div>
              )}

            <div data-page-animate="item">
              <Checkbox
                id="terms-and-conditions"
                name="terms and conditions"
                checked={isTermsAccepted}
                onChange={(e) =>
                  setTermsAndConditionsAccepted(e.target.checked)
                }
                label={
                  <>
                    I agree with the{" "}
                    <Link
                      to="/terms-and-conditions"
                      className="text-brand-fg underline-offset-2 hover:underline"
                    >
                      terms and conditions
                    </Link>
                  </>
                }
              />
            </div>

            <div data-page-animate="item" className="flex flex-col gap-2">
              <Button
                size="lg"
                className="w-full"
                icon="arrowRight"
                iconPosition="right"
                disabled={
                  !isTermsAccepted ||
                  !hasValidFile ||
                  !!uploadError ||
                  fileValidationState === "checking"
                }
                onClick={onElaborateFile}
              >
                Start analysis
              </Button>

              {!selectedZipFile && !isDemo && (
                <p className="text-fg-muted text-center text-xs">
                  Upload a ZIP file to continue.
                </p>
              )}

              {selectedZipFile &&
                !isDemo &&
                fileValidationState === "invalid" && (
                  <p className="text-fg-muted text-center text-xs">
                    Upload a valid Instagram export ZIP to continue.
                  </p>
                )}
            </div>
          </div>

          <div
            data-page-animate="content"
            className="flex min-w-0 flex-col gap-4 lg:col-start-1 lg:row-start-2"
          >
            <div data-page-animate="item">
              <h2 className="text-fg text-base font-semibold">
                What happens next?
              </h2>
              <ol className="border-line-subtle divide-line-subtle mt-3 flex flex-col divide-y overflow-hidden rounded-card border">
                {[
                  "Your Instagram data is securely read from the ZIP file",
                  "Your followers and following lists are analyzed",
                  "You'll see who follows you back, who doesn't, and recent changes in your connections",
                ].map((step, index) => (
                  <li
                    key={step}
                    className="text-fg-muted flex gap-3 px-4 py-3 text-sm leading-6"
                  >
                    <span
                      aria-hidden="true"
                      className="border-line-strong bg-surface-2 text-fg flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold tabular-nums"
                    >
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <div data-page-animate="item">
              <Callout title="Your data stays on this device" variant="info">
                Your data is processed locally in your browser. No files are
                uploaded, stored, or shared with external servers.
              </Callout>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
