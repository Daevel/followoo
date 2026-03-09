import { FooterSignature } from "./components/ui/FooterSignature";
import { Button } from "./components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { Container } from "./components/ui/Container";
import { HeroIllustrations } from "./components/ui/HeroIllustrations";

export default function App() {
  const navigate = useNavigate();

  return (
    <section className="min-h-svh flex flex-col">
      <Container className="min-h-svh flex flex-col">
        <div className="flex flex-col items-center pt-30 pb-6 text-center flex-1">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl font-semibold leading-headers text-foreground md:text-5xl">
              Followoo
            </h1>

            <p className="mt-4 max-w-[18rem] text-sm text-foreground/90 md:max-w-[24rem] md:text-foreground">
              Welcome to follow/unfollow instagram compare app
            </p>

            <Link
              to="/instructions-to-start"
              className="mt-8 text-foreground underline"
            >
              Don't know how to start?
            </Link>

            <div className="mt-10">
              <Button
                background="primary"
                foreground="foreground"
                icon="arrowRight"
                iconPosition="right"
                onClick={() => navigate("/get-started")}
              >
                Get started
              </Button>
            </div>

            <div className="mt-auto w-full pt-12">
              <HeroIllustrations />
            </div>
          </div>
        </div>
        <FooterSignature />
      </Container>
    </section>
  );
}
