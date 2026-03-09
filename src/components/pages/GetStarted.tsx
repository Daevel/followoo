import { Link, useNavigate } from "react-router";
import { Container } from "../ui/Container";
import { FooterSignature } from "../ui/FooterSignature";
import { Button } from "../ui/Button";
import { NavBar } from "../ui/NavBar";
import { useState } from "react";
import { Loading } from "../ui/Loading";
import { ZipDropzone } from "../ui/ZipDropzone";
import { Callout } from "../ui/Callout";
import { Checkbox } from "../ui/Checkbox";

export function GetStarted() {
  const navigate = useNavigate();
  const [selectedZipFile, setSelectedZipFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [termsAndConditionsAccepted, setTermsAndConditionsAccepted] =
    useState<boolean>(false);

  async function onElaborateFile() {
    if (!selectedZipFile) {
      alert("Select a .zip file first");
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      navigate("/results");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="min-h-svh flex flex-col">
      <Container className="min-h-svh flex flex-col">
        <NavBar />
        <div className="flex flex-col items-start pt-15 pb-6 text-center flex-1">
          <h1 className="text-4xl font-semibold leading-headers text-foreground md:text-5xl">
            Select your zip file
          </h1>

          <div className="flex flex-col items-center text-start">
            <div className="w-auto py-12 flex flex-col items-center gap-10">
              <ZipDropzone
                file={selectedZipFile}
                onFileChange={setSelectedZipFile}
                onError={setUploadError}
              />

              {uploadError && (
                <p className="w-full p1-r text-accent">{uploadError}</p>
              )}

              <div className="text-foreground items-start flex flex-col gap-10">
                <div className="w-auto text-foreground items-start">
                  <label className="l1-b">What's going to happen?</label>
                  <p className="p1-r">
                    Lorem ipsum dolor sit amet consectetur. Facilisi nunc lectus
                    integer donec. Luctus nulla gravida placerat neque nibh
                    scelerisque aenean eget. Sociis feugiat amet euismod
                    bibendum magna arcu sed proin orci.
                  </p>
                </div>

                <div className="text-foreground items-start w-full">
                  <Callout title="Important: Data usage" variant="warning">
                    <b>Followoo</b> will{" "}
                    <b className="text-accent">never store</b> your data in the
                    platform to track and perform metrics.
                  </Callout>
                </div>
              </div>
            </div>

            <div className="w-auto flex flex-row gap-4 items-center mt-20">
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

            <div className="mt-5">
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
                Analyze followers
              </Button>
            </div>
          </div>
        </div>

        <FooterSignature />
      </Container>
    </section>
  );
}
