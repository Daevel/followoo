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

    return new File([blob], vercelBlobStructure.demoFile, {
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
          className="flex flex-1 flex-col items-start pt-15 pb-6 text-center"
        >
          <h1
            data-animate="hero-item"
            className="leading-headers text-foreground text-4xl font-semibold md:text-5xl"
          >
            Select your zip file
          </h1>

          <div className="flex flex-col items-center text-start">
            <div
              data-animate="hero-item"
              className="flex w-auto flex-col items-center gap-10 py-12"
            >
              {!isDemo && (
                <ZipDropzone
                  file={selectedZipFile}
                  onFileChange={setSelectedZipFile}
                  onError={setUploadError}
                />
              )}

              {isDemo && (
                <Callout title="Demo mode" variant="info">
                  A sample Instagram export will be used automatically to show
                  how the analysis works.
                </Callout>
              )}

              {uploadError && (
                <p data-animate="hero-item" className="p1-r text-accent w-full">
                  {uploadError}
                </p>
              )}

              <div className="text-foreground flex flex-col items-start gap-10">
                <div className="text-foreground flex w-auto flex-col items-start gap-4">
                  <label data-animate="hero-item" className="l1-b">
                    What's going to happen?
                  </label>

                  <div
                    data-animate="hero-item"
                    className="p1-r flex flex-col gap-3"
                  >
                    <p>
                      Your Instagram export will be analyzed directly in your
                      browser.
                    </p>

                    <p>The application will:</p>

                    <ul className="flex list-disc flex-col gap-1 pl-5">
                      <li>
                        Extract followers and following lists from the ZIP file
                      </li>
                      <li>Compare the relationships between accounts</li>
                      <li>
                        Show mutual connections, followers, unfollowers, and
                        recently unfollowed accounts
                      </li>
                    </ul>

                    <p className="text-foreground/80 font-medium">
                      The file is processed locally and is never uploaded to any
                      server.
                    </p>
                  </div>
                </div>

                <div
                  data-animate="hero-item"
                  className="text-foreground w-full items-start"
                >
                  <Callout title="Important: Data usage" variant="warning">
                    Your <b>data</b> is processed locally in your browser. No
                    files are <b className="text-accent">uploaded</b>,{" "}
                    <b className="text-accent">stored</b>, or{" "}
                    <b className="text-accent">shared</b> with external servers.
                  </Callout>
                </div>
              </div>
            </div>

            <div
              data-animate="hero-item"
              className="mt-20 flex w-auto flex-row items-center gap-4"
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

            <div data-animate="hero-item" className="mt-5">
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
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
