import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Container } from "../../components/ui/Container";
import { Icon } from "../../components/ui/Icon";

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="pt-24 md:pt-28">
      <Container>
        <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
          <div className="max-w-4xl">
            <h1 className="hero-h1 font-semibold">
              Discover who doesn't follow you back on Instagram
            </h1>

            <div className="mt-6 flex items-center justify-center gap-3 text-accent">
              <Icon name="shield" color="accent" width={32} height={32} />
              <h3>Your data never leaves your device</h3>
            </div>

            <div className="flex flex-row justify-center gap-2 mt-8 max-sm:flex-col max-sm:gap-y-2">
              <Button
                background="accent"
                foreground="foreground"
                onClick={() => navigate("/get-started")}
              >
                Analyze your data
              </Button>
              <Button
                background="primary"
                foreground="foreground"
                onClick={() => navigate("/get-started")}
              >
                Try demo
              </Button>
            </div>
          </div>

          <div className="mt-12 w-full max-w-3xl">
            <img
              src="images/double-phone-hero-landing-page.svg"
              alt="Preview of Followoo results on mobile"
              className="mx-auto block h-auto w-full max-w-2xl sm:max-w-3xl"
            />
          </div>

          <div className="mt-12 grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
            {[
              "100% locally runned",
              "No API calls",
              "Open Source (MIT)",
            ].map((item) => (
              <div key={item} className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-15 w-15 items-center justify-center rounded-full bg-accent">
                  <Icon name="shield" color="foreground" width={30} height={30} />
                </div>
                <h3>{item}</h3>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}