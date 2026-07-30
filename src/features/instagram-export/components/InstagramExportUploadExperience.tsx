import { useRef } from "react";
import { Link } from "react-router";
import { useStandardPageAnimation } from "@/animations/pages/useStandardPageAnimation";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Checkbox } from "@/components/ui/Checkbox";
import { Container } from "@/components/ui/Container";
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
  } = useInstagramExportAnalysis({ isDemo });

  const rootRef = useRef<HTMLDivElement | null>(null);

  useStandardPageAnimation(rootRef);

  if (loading) {
    return <Loading ref={loadingRef} loading={loading} />;
  }

  return (
    <section className="flex min-h-svh flex-col">
      <NavBar />

      <Container className="flex min-h-svh flex-col">
        <div
          ref={rootRef}
          className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-start px-4 pt-16 pb-10 text-left md:px-0 md:pt-20"
        >
          <h1
            data-page-animate="heading"
            className="leading-headers text-foreground text-4xl font-semibold md:text-5xl"
          >
            Upload your Instagram ZIP
          </h1>

          <p
            data-page-animate="subheading"
            className="text-foreground/80 mt-4 max-w-2xl text-lg leading-8"
          >
            Your export will be analyzed directly in your browser. Nothing is
            uploaded to external servers.
          </p>

          {isDemo && (
            <div data-page-animate="callout" className="mt-6 w-full">
              <Callout title="Demo mode" variant="info">
                A sample Instagram export will be used automatically to show how
                the analysis works.
              </Callout>
            </div>
          )}

          <div
            data-page-animate="content"
            className="mt-8 flex w-full flex-col gap-5"
          >
            {!isDemo && (
              <div data-page-animate="item" className="w-full">
                <p className="text-foreground mb-3 text-sm font-semibold">
                  Current export
                </p>
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
              <p
                data-page-animate="item"
                className="text-foreground/60 text-sm"
              >
                No file selected yet. Only <b>.zip</b> files are supported.
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

            {!isDemo &&
              (fileValidationState === "invalid" || uploadError) &&
              fileValidationMessage && (
                <div data-page-animate="item" className="w-full">
                  <Callout title="Invalid file" variant="warning">
                    {fileValidationMessage}
                  </Callout>
                </div>
              )}
          </div>

          <div
            data-page-animate="content"
            className="mt-10 flex w-full flex-col gap-8"
          >
            <div
              data-page-animate="item"
              className="text-foreground flex w-full flex-col items-start gap-4"
            >
              <h2 className="text-foreground text-xl font-semibold">
                What happens next?
              </h2>

              <div className="text-foreground/85 flex flex-col gap-4 text-base leading-7">
                <ul className="flex list-disc flex-col gap-2 pl-5">
                  <li>
                    Your Instagram data is securely read from the ZIP file
                  </li>
                  <li>Your followers and following lists are analyzed</li>
                  <li>
                    You&apos;ll see who follows you back, who doesn&apos;t, and
                    recent changes in your connections
                  </li>
                </ul>
              </div>
            </div>

            <div data-page-animate="item" className="w-full">
              <Callout title="Your data stays on this device" variant="info">
                Your <b>data</b> is processed locally in your browser. No files
                are <b>uploaded</b>, <b>stored</b>, or <b>shared</b> with
                external servers.
              </Callout>
            </div>
          </div>

          <div
            data-page-animate="content"
            className="mt-8 flex w-full flex-col items-center gap-4"
          >
            <div
              data-page-animate="item"
              className="flex w-full justify-center"
            >
              <Checkbox
                id="terms-and-conditions"
                name="terms and conditions"
                checked={isTermsAccepted}
                onChange={(e) =>
                  setTermsAndConditionsAccepted(e.target.checked)
                }
                label={
                  <>
                    I agree with{" "}
                    <Link to="/terms-and-conditions">
                      <b className="text-foreground underline">
                        terms and conditions
                      </b>
                    </Link>
                  </>
                }
              />
            </div>

            <div data-page-animate="item">
              <Button
                background="accent"
                foreground="foreground"
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
            </div>

            {!selectedZipFile && !isDemo && (
              <p
                data-page-animate="item"
                className="text-foreground/50 text-xs"
              >
                Upload a ZIP file to continue.
              </p>
            )}

            {selectedZipFile &&
              !isDemo &&
              fileValidationState === "invalid" && (
                <p
                  data-page-animate="item"
                  className="text-foreground/50 text-xs"
                >
                  Upload a valid Instagram export ZIP to continue.
                </p>
              )}
          </div>
        </div>
      </Container>
    </section>
  );
}
