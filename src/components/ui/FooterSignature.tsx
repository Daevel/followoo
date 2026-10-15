import { Link } from "react-router";

const linkClass =
  "text-fg-muted hover:text-fg focus-visible:shadow-ring rounded-sm text-sm transition-colors focus-visible:outline-none";

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-fg text-[13px] font-semibold">{title}</p>
      <div className="flex flex-col items-start gap-2.5">{children}</div>
    </div>
  );
}

export function FooterSignature() {
  return (
    <footer className="w-full text-start sm:py-8">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex max-w-xs flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <img src="/favicon.svg" alt="" width={24} height={24} />
            <span className="text-fg text-[15px] font-semibold tracking-[-0.01em]">
              Followoo
            </span>
          </div>
          <p className="text-fg-muted text-[13px] leading-[1.55]">
            Not affiliated with Instagram or Meta.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:gap-16">
          <FooterColumn title="Pages">
            <Link to="/" className={linkClass}>
              Home
            </Link>
            <Link
              to="/get-started"
              className={linkClass}
              state={{ isDemo: false }}
            >
              Get Started
            </Link>
            <Link to="/support" className={linkClass}>
              Support
            </Link>
            <Link to="/updates" className={linkClass}>
              Updates
            </Link>
          </FooterColumn>

          <FooterColumn title="Rules & Privacy">
            <Link to="/terms-and-conditions" className={linkClass}>
              Terms and conditions
            </Link>
            <Link to="/privacy-and-policy" className={linkClass}>
              Privacy Policy
            </Link>
          </FooterColumn>

          <FooterColumn title="Social">
            <a
              href="https://github.com/Daevel/followoo"
              target="_blank"
              rel="noreferrer"
              className={linkClass}
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/luigi-avitabile"
              target="_blank"
              rel="noreferrer"
              className={linkClass}
            >
              LinkedIn
            </a>
          </FooterColumn>
        </div>
      </div>
    </footer>
  );
}
