import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { ANALYTICS_EVENTS, analyticsService } from "@/analytics";
import { animateLoadingOut } from "@/animations/loading/useAnimateLoadingOut";
import { useStandardPageAnimation } from "@/animations/pages/useStandardPageAnimation";
import { analyzeInstagramExport } from "@/components/services/instagramAnalisysService";
import { parseInstagramExport } from "@/components/services/instagramExportService";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Checkbox } from "@/components/ui/Checkbox";
import { Container } from "@/components/ui/Container";
import { Loading } from "@/components/ui/Loading";
import { NavBar } from "@/components/ui/NavBar";
import Seo from "@/components/ui/Seo";
import { ZipDropzone } from "@/components/ui/ZipDropzone";
import { vercelBlobStructure } from "@/data/vercelBlobStructure";
import { handleAppError } from "@/errors";

type FileValidationState = "idle" | "checking" | "valid" | "invalid";

export function GetStarted() {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedZipFile, setSelectedZipFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [termsAndConditionsAccepted, setTermsAndConditionsAccepted] =
    useState<boolean>(false);

  const [fileValidationState, setFileValidationState] =
    useState<FileValidationState>("idle");
  const [fileValidationMessage, setFileValidationMessage] = useState("");

  const rootRef = useRef<HTMLDivElement | null>(null);

  // LOADING TRANSITION
  const [isTransitioning, setIsTransitioning] = useState(false);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  const isDemo: boolean = location.state?.isDemo ?? false;
  const isTermsAccepted = isDemo || termsAndConditionsAccepted;
  const hasValidFile =
    isDemo || (Boolean(selectedZipFile) && fileValidationState === "valid");

  useStandardPageAnimation(rootRef);

  const validateFile = useCallback(async (file: File) => {
    setUploadError("");
    setFileValidationState("checking");
    setFileValidationMessage("");

    try {
      await parseInstagramExport(file);
      setFileValidationState("valid");
      setFileValidationMessage("Valid Instagram export detected.");
    } catch {
      setFileValidationState("invalid");
      setFileValidationMessage(
        "Invalid file format. Please upload a valid Instagram export ZIP downloaded from the Meta Accounts Center."
      );
    }
  }, []);

  useEffect(() => {
    let abortController: AbortController | null = null;

    const runEffect = async () => {
      if (isDemo) {
        setFileValidationState("valid");
        setFileValidationMessage("Valid Instagram export detected.");
        return;
      }

      if (!selectedZipFile) {
        setFileValidationState("idle");
        setFileValidationMessage("");
        return;
      }

      abortController = new AbortController();
      await validateFile(selectedZipFile);
    };

    void runEffect();

    return () => {
      abortController?.abort();
    };
  }, [selectedZipFile, isDemo, validateFile]);

  async function loadDemoZipFile() {
    const response = await fetch(vercelBlobStructure.demoFile);

    if (!response.ok) {
      handleAppError("error", {
        fallbackTitle: "Invalid file",
      });
      return;
    }

    const blob = await response.blob();

    return new File([blob], "demo-followoo-export.zip", {
      type: "application/zip",
    });
  }

  async function onElaborateFile() {
    if (isTransitioning) return;
    if (!hasValidFile) return;

    analyticsService.track(ANALYTICS_EVENTS.ANALYSIS_STARTED, {
      has_file: Boolean(selectedZipFile),
      terms_accepted: termsAndConditionsAccepted,
    });

    setUploadError("");
    setLoading(true);

    const MIN_LOADING_TIME = 2500;
    const start = Date.now();

    try {
      const zipFile = isDemo ? await loadDemoZipFile() : selectedZipFile;

      if (!zipFile) {
        setUploadError("Failed to load the ZIP file. Please try again.");
        setLoading(false);
        return;
      }

      const exportData = await parseInstagramExport(zipFile);
      const analysis = analyzeInstagramExport(exportData);

      analyticsService.track(ANALYTICS_EVENTS.ANALYSIS_COMPLETED, {
        followers_count: exportData.followers.length,
        following_count: exportData.following.length,
        mutual_count: analysis.mutual.length,
        unfollowers_count: analysis.unfollowers.length,
        recent_unfollowers_count: analysis.recentUnfollowers.length,
        blocked_count: analysis.blocked.length,
        restricted_count: analysis.restricted.length,
        close_friends_count: analysis.closeFriends.length,
      });

      const elapsed = Date.now() - start;
      const remaining = Math.max(0, MIN_LOADING_TIME - elapsed);

      if (remaining > 0) {
        await new Promise((resolve) => setTimeout(resolve, remaining));
      }

      setIsTransitioning(true);

      if (loadingRef.current) {
        await animateLoadingOut(loadingRef.current);
      }

      navigate("/results", {
        state: analysis,
      });
    } catch (error) {
      handleAppError(error, {
        fallbackTitle: "Invalid file",
      });

      setLoading(false);
      setIsTransitioning(false);
    }
  }

  if (loading) {
    return <Loading ref={loadingRef} loading={loading} />;
  }

  return (
    <>
      <Seo
        title="Followoo - Get Started"
        description="Start analyzing your Instagram followers. Upload your Instagram data to compare your engagement and growth with others."
        image="https://followoo.app/favicon.svg"
        canonical="https://followoo.app/get-started"
      />
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
                  A sample Instagram export will be used automatically to show
                  how the analysis works.
                </Callout>
              </div>
            )}

            <div
              data-page-animate="content"
              className="mt-8 flex w-full flex-col gap-5"
            >
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
                      You&apos;ll see who follows you back, who doesn&apos;t,
                      and recent changes in your connections
                    </li>
                  </ul>
                </div>
              </div>

              <div data-page-animate="item" className="w-full">
                <Callout title="Your data stays on this device" variant="info">
                  Your <b>data</b> is processed locally in your browser. No
                  files are <b>uploaded</b>, <b>stored</b>, or <b>shared</b>{" "}
                  with external servers.
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
    </>
  );
}
