import { Link, useNavigate } from "react-router";
import { Container } from "../ui/Container";
import { FooterSignature } from "../ui/FooterSignature";
import { Button } from "../ui/Button";
import { NavBar } from "../ui/NavBar";
import { Icon } from "../ui/Icon";
import { useRef, useState } from "react";
import { Loading } from "../ui/Loading";

export function GetStarted() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedZipFile, setSelectedZipFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [termsAndConditionsAccepted, setTermsAndConditionsAccepted] =
    useState<boolean>(false);

  function onSelectZipFile() {
    fileInputRef.current?.click();
  }

  function onZipFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const isZip =
      file.type === "application/zip" ||
      file.name.toLowerCase().endsWith(".zip");

    if (!isZip) {
      alert("Please select a .zip file");
      event.target.value = "";
      return;
    }

    setSelectedZipFile(file);
  }

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

  function onDeleteZipFile() {
    setSelectedZipFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
          <h2 className="text-4xl font-semibold leading-headers text-base md:text-5xl">
            Select your zip file
          </h2>

          <div className="flex flex-col items-center text-start">
            <div className="w-auto pt-10 flex flex-col items-center gap-10">
              <input
                ref={fileInputRef}
                type="file"
                accept=".zip,application/zip"
                onChange={onZipFileChange}
                className="hidden"
              />

              <Button
                color="primary"
                type="button"
                onClick={onSelectZipFile}
                className="w-full cursor-pointer"
              >
                Select your zip here
              </Button>

              <div className="w-full flex flex-row items-center gap-4 mt-auto text-base justify-between">
                <p className="p1-r">
                  {selectedZipFile ? selectedZipFile.name : "No file selected"}
                </p>
                <Icon
                  name="trash"
                  color="accent"
                  onClick={onDeleteZipFile}
                  className="sm:h-8 sm:w-8 lg:h-11 lg:w-11 cursor-pointer"
                />
              </div>

              <div className="text-base items-start flex flex-col gap-10">
                <div className="w-auto text-base items-start">
                  <label className="l1-b">What's going to happen?</label>
                  <p className="p1-r">
                    Lorem ipsum dolor sit amet consectetur. Facilisi nunc lectus
                    integer donec. Luctus nulla gravida placerat neque nibh
                    scelerisque aenean eget. Sociis feugiat amet euismod
                    bibendum magna arcu sed proin orci.
                  </p>
                </div>

                <div className="text-base items-start">
                  <div className="flex flex-col items-start gap-4 mt-auto text-base">
                    <div className="flex flex-row gap-4 items-center">
                      <label className="l1-b text-accent">
                        Important: Data usage
                      </label>
                      <Icon
                        name="warning"
                        color="accent"
                        className="sm:h-6 sm:w-6 lg:h-11 lg:w-11"
                      />
                    </div>
                    <p className="p1-r">
                      <b>Followoo</b> will{" "}
                      <b className="text-accent">never store</b> your data in
                      the platform to track and perform metrics. Every
                      elaboration will be done from scratch as a new comparison.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-auto flex flex-row gap-4 items-center mt-20">
              <p className="text-base">
                I agree with{" "}
                <Link to="/terms-and-conditions">
                  <b className="underline text-base">terms and conditions</b>
                </Link>
              </p>
              <input
                type="checkbox"
                name="terms and conditions"
                id="terms-and-conditions"
                checked={termsAndConditionsAccepted}
                onChange={(e) =>
                  setTermsAndConditionsAccepted(e.target.checked)
                }
              />
            </div>

            <Button
              color="accent"
              disabled={!termsAndConditionsAccepted || !selectedZipFile}
              onClick={onElaborateFile}
            >
              Elaborate
            </Button>
          </div>
        </div>

        <FooterSignature />
      </Container>
    </section>
  );
}
