import { Link } from "react-router-dom";

export function FooterSignature() {
  return (
    <footer className="w-full py-12">
      <div className="flex flex-col gap-10 md:gap-12 lg:flex-row lg:items-start lg:justify-around">
        <div className="shrink-0">
          <img src="/favicon.svg" alt="Followoo logo" width={30} height={30} />
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16">
          <div className="flex flex-col gap-6">
            <h4 className="text-lg font-medium">Pages</h4>
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                className="text-foreground/50 hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <Link
                to="/get-started"
                className="text-foreground/50 hover:text-foreground transition-colors"
                state={{ isDemo: false }}
              >
                Get Started
              </Link>
              <Link
                to="/help"
                className="text-foreground/50 hover:text-foreground transition-colors"
              >
                Support
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="text-lg font-medium">Rules & Privacy</h4>
            <div className="flex flex-col gap-4">
              <Link
                to="/terms-and-conditions"
                className="text-foreground/50 hover:text-foreground transition-colors"
              >
                Terms and conditions
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="text-lg font-medium">Social</h4>
            <div className="flex flex-col gap-4">
              <a
                href="https://github.com/Daevel/followoo"
                target="_blank"
                rel="noreferrer"
                className="text-foreground/50 hover:text-foreground transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/luigi-avitabile"
                target="_blank"
                rel="noreferrer"
                className="text-foreground/50 hover:text-foreground transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
