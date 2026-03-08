import { useNavigate } from "react-router";
import { Button } from "../ui/Button";
import { Container } from "../ui/Container";
import { FooterSignature } from "../ui/FooterSignature";
import { NavBar } from "../ui/NavBar";

export function InstructionsToStart() {
  const navigate = useNavigate();

  return (
    <section className="min-h-svh">
      <Container>
        <NavBar showHelp={false} />
        <div className="flex flex-col items-start pt-16 pb-6">
          <h2 className="text-4xl font-semibold leading-headers text-base md:text-5xl">
            What are the next steps?
          </h2>
          <div className="flex flex-col items-center text-start">
            <div className="w-auto pt-10 flex flex-col items-start gap-10">
              <div className="mt-auto text-base">
                <label className="l1-b">1. Download your Instagram data</label>
                <p className="p1-r">
                  Lorem ipsum dolor sit amet consectetur. In leo iaculis
                  sagittis auctor eu elit facilisi. Orci sit eget sed phasellus.
                </p>
              </div>

              <div className="mt-auto text-base">
                <label className="l1-b">
                  2. Search for “Download your informations” in your settings
                </label>
                <p className="p1-r">
                  Lorem ipsum dolor sit amet consectetur. In leo iaculis
                  sagittis auctor eu elit facilisi. Orci sit eget sed phasellus.
                </p>
              </div>

              <div className="mt-auto text-base">
                <label className="l1-b">
                  3. Export the document as a JSON file
                </label>
                <p className="p1-r">
                  Lorem ipsum dolor sit amet consectetur. In leo iaculis
                  sagittis auctor eu elit facilisi. Orci sit eget sed phasellus.
                </p>
              </div>

              <div className="mt-auto text-base">
                <label className="l1-b">
                  4. Extract your files and save them into your device
                </label>
                <p className="p1-r">
                  Lorem ipsum dolor sit amet consectetur. In leo iaculis
                  sagittis auctor eu elit facilisi. Orci sit eget sed phasellus.
                </p>
              </div>

              <div className="mt-auto text-base">
                <label className="l1-b">
                  5. Select followers and following files into the comparator
                  and start the process
                </label>
                <p className="p1-r">
                  Lorem ipsum dolor sit amet consectetur. In leo iaculis
                  sagittis auctor eu elit facilisi. Orci sit eget sed phasellus.
                </p>
              </div>
            </div>

            <Button color="primary" onClick={() => navigate("/get-started")}>
              Got it? Now Let's compare!
            </Button>

            <FooterSignature />
          </div>
        </div>
      </Container>
    </section>
  );
}
