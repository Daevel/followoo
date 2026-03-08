import { Button } from "../ui/Button";
import { Container } from "../ui/Container";
import { FooterSignature } from "../ui/FooterSignature";
import { Input } from "../ui/Input";
import { NavBar } from "../ui/NavBar";

export function HelpSection() {
  async function onSendHelpForm() {
    return null;
  }

  return (
    <section className="min-h-svh">
      <Container>
        <NavBar showHelp={false} />
        <div className="flex flex-col items-start pt-16 pb-6 text-base">
          <div className="flex flex-col items-start text-start mb-10">
            <h2 className="text-4xl font-semibold leading-headers text-base md:text-5xl">
              Help section
            </h2>
            <p className="p1-r">
              Found any bugs or suggestions for better implementation? Fill the
              form below with your informations and I'll be grateful to read it.
            </p>
          </div>

          <div className="w-full flex flex-col items-center">
            <div className="w-full pt-5 flex flex-col items-center gap-10">
              <div className="w-full flex flex-col items-center text-start">
                <form action="onSendHelpForm" className="w-full flex flex-col gap-6">
                  <label className="l1-b">Full name</label>
                  <Input
                    variant="input"
                    placeholder="Enter your full name here..."
                  ></Input>

                  <label className="l1-b">Email</label>
                  <Input
                    variant="input"
                    placeholder="Enter your email here..."
                  ></Input>

                  <label className="l1-b">Message</label>
                  <Input
                    variant="textarea"
                    placeholder="Enter your message here..."
                  />
                </form>
              </div>
            </div>

            <Button color="primary" onClick={onSendHelpForm}>
              Send
            </Button>

            <FooterSignature />
          </div>
        </div>
      </Container>
    </section>
  );
}
