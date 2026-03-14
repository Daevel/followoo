import { Link, useNavigate } from "react-router";
import { Container } from "../ui/Container";
import { FooterSignature } from "../ui/FooterSignature";
import { Button } from "../ui/Button";
import { NavBar } from "../ui/NavBar";
import { useLayoutEffect, useRef, useState } from "react";
import { Loading } from "../ui/Loading";
import { ZipDropzone } from "../ui/ZipDropzone";
import { Callout } from "../ui/Callout";
import { Checkbox } from "../ui/Checkbox";
import { gsap } from "gsap";
import { parseInstagramExport } from "../services/instagramExportService";
import { analyzeInstagramExport } from "../services/instagramAnalisysService";
import { toastService } from "../services/toastService";

export function GetStarted() {
  const navigate = useNavigate();
  const [selectedZipFile, setSelectedZipFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [termsAndConditionsAccepted, setTermsAndConditionsAccepted] =
    useState<boolean>(false);

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

  async function onElaborateFile() {
    if (!selectedZipFile) {
      alert("Select a .zip file first");
      return;
    }

    setLoading(true);

    const MIN_LOADING_TIME = 2500;
    const start = Date.now();

    try {
      const exportData = await parseInstagramExport(selectedZipFile);

      const hasAnyData =
        exportData.followers.length > 0 ||
        exportData.following.length > 0 ||
        exportData.recentlyUnfollowed.length > 0 ||
        exportData.pendingFollowRequests.length > 0 ||
        exportData.recentFollowRequests.length > 0 ||
        exportData.blocked.length > 0 ||
        exportData.restricted.length > 0 ||
        exportData.closeFriends.length > 0 ||
        exportData.hideStoriesFrom.length > 0;

      if (!hasAnyData) {
        toastService.warning({
          title: "Invalid file",
          description: "This ZIP file does not look like a valid Instagram export, or it does not contain supported relationship data.",
        })

                toastService.info({
          title: "Invalid file",
          description: "This ZIP file does not look like a valid Instagram export, or it does not contain supported relationship data.",
        })

                toastService.success({
          title: "Invalid file",
          description: "This ZIP file does not look like a valid Instagram export, or it does not contain supported relationship data.",
        })
        return;
      }

      const analysis = analyzeInstagramExport(exportData);

      const elapsed = Date.now() - start;
      const remaining = Math.max(0, MIN_LOADING_TIME - elapsed);
      if (remaining > 0) {
        await new Promise((resolve) => setTimeout(resolve, remaining));
      }

      navigate("/results", {
        state: analysis,
      });
    } catch (error) {
      console.error("Failed to parse Instagram export:", error);
      alert("Failed to read the ZIP file.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <Loading loading={loading} />;
  }
  return (
    <section className="min-h-svh flex flex-col">
      <Container className="min-h-svh flex flex-col">
        <NavBar />
        <div
          ref={rootRef}
          className="flex flex-col items-start pt-15 pb-6 text-center flex-1"
        >
          <h1
            data-animate="hero-item"
            className="text-4xl font-semibold leading-headers text-foreground md:text-5xl"
          >
            Select your zip file
          </h1>

          <div className="flex flex-col items-center text-start">
            <div
              data-animate="hero-item"
              className=" w-auto py-12 flex flex-col items-center gap-10"
            >
              <ZipDropzone
                file={selectedZipFile}
                onFileChange={setSelectedZipFile}
                onError={setUploadError}
              />

              {uploadError && (
                <p data-animate="hero-item" className="w-full p1-r text-accent">
                  {uploadError}
                </p>
              )}

              <div className="text-foreground items-start flex flex-col gap-10">
                <div className="w-auto text-foreground items-start flex flex-col gap-4">
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

                    <ul className="list-disc pl-5 flex flex-col gap-1">
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
                  className="text-foreground items-start w-full"
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
              className="w-auto flex flex-row gap-4 items-center mt-20"
            >
              <Checkbox
                id="terms-and-conditions"
                name="terms and conditions"
                checked={termsAndConditionsAccepted}
                onChange={(e) =>
                  setTermsAndConditionsAccepted(e.target.checked)
                }
                label={
                  <>
                    I agree with{" "}
                    <Link to="/terms-and-conditions">
                      <b className="underline text-foreground">
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
                disabled={
                  !termsAndConditionsAccepted ||
                  !selectedZipFile ||
                  !!uploadError
                }
                onClick={onElaborateFile}
              >
                Start analysis
              </Button>
            </div>
          </div>
        </div>
        <FooterSignature />
      </Container>
    </section>
  );
}
