import { ANALYTICS_EVENTS, analyticsService } from "@/analytics";
import { vercelBlobStructure } from "@/data/vercelBlobStructure";
import { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { handleAppError } from "../../errors";
import { analyzeInstagramExport } from "../services/instagramAnalisysService";
import { parseInstagramExport } from "../services/instagramExportService";
import { Button } from "../ui/Button";
import { Callout } from "../ui/Callout";
import { Checkbox } from "../ui/Checkbox";
import { Container } from "../ui/Container";
import { Loading } from "../ui/Loading";
import { NavBar } from "../ui/NavBar";
import { ZipDropzone } from "../ui/ZipDropzone";

export function GetStarted() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedZipFile, setSelectedZipFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [termsAndConditionsAccepted, setTermsAndConditionsAccepted] =
    useState<boolean>(false);

  const rootRef = useRef<HTMLDivElement | null>(null);

  const isDemo: boolean = location.state?.isDemo ?? false;
  const isTermsAccepted = isDemo || termsAndConditionsAccepted;
  const hasValidFile = isDemo || Boolean(selectedZipFile);

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

      navigate("/results", {
        state: analysis,
      });
    } catch (error) {
      handleAppError(error, {
        fallbackTitle: "Invalid file",
      });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <Loading loading={loading} />;
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
            data-animate="hero-item"
            className="leading-headers text-foreground text-4xl font-semibold md:text-5xl"
          >
            Upload your Instagram ZIP
          </h1>

          <p
            data-animate="hero-item"
            className="text-foreground/80 mt-4 max-w-2xl text-lg leading-8"
          >
            Your export will be analyzed directly in your browser. Nothing is
            uploaded to our servers.
          </p>

          {isDemo && (
            <div data-animate="hero-item" className="mt-6 w-full">
              <Callout title="Demo mode" variant="info">
                A sample Instagram export will be used automatically to show how
                the analysis works.
              </Callout>
            </div>
          )}

          <div
            data-animate="hero-item"
            className="mt-8 flex w-full flex-col gap-5"
          >
            {!isDemo && (
              <div className="w-full">
                <ZipDropzone
                  file={selectedZipFile}
                  onFileChange={setSelectedZipFile}
                  onError={setUploadError}
                />
              </div>
            )}

            {!isDemo && !selectedZipFile && !uploadError && (
              <p className="text-foreground/60 text-sm">
                No file selected yet. Only <b>.zip</b> files are supported.
              </p>
            )}

            {uploadError && (
              <p className="text-accent w-full text-sm font-medium">
                {uploadError}
              </p>
            )}
          </div>

          <div className="mt-10 flex w-full flex-col gap-8">
            <div
              data-animate="hero-item"
              className="text-foreground flex w-full flex-col items-start gap-4"
            >
              <h2 className="text-foreground text-xl font-semibold">
                What happens next?
              </h2>

              <div className="text-foreground/85 flex flex-col gap-4 text-base leading-7">
                <ul className="flex list-disc flex-col gap-2 pl-5">
                  <li>Extract followers and following lists from your ZIP</li>
                  <li>Compare the relationships between accounts</li>
                  <li>
                    Show mutuals, followers, unfollowers, and recently
                    unfollowed accounts
                  </li>
                </ul>

                <p className="text-foreground font-medium">
                  Everything is processed locally in your browser.
                </p>
              </div>
            </div>

            <div data-animate="hero-item" className="w-full">
              <Callout title="Your data stays on this device" variant="info">
                Your <b>data</b> is processed locally in your browser. No files
                are <b>uploaded</b>, <b>stored</b>, or <b>shared</b> with
                external servers.
              </Callout>
            </div>
          </div>

          <div
            data-animate="hero-item"
            className="mt-8 flex w-full flex-col items-center gap-4"
          >
            <div className="flex w-full justify-center">
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

            <Button
              background="accent"
              foreground="foreground"
              icon="arrowRight"
              iconPosition="right"
              disabled={!isTermsAccepted || !hasValidFile || !!uploadError}
              onClick={onElaborateFile}
            >
              Start analysis
            </Button>

            {!hasValidFile && !isDemo && (
              <p className="text-foreground/50 text-xs">
                Upload a ZIP file to continue.
              </p>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
