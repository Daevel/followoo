import clsx from "clsx";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Icon } from "./Icon";

const navLinks = [
  { to: "/instructions-to-start", label: "How to start" },
  { to: "/get-started", label: "Analyze your export" },
  { to: "/terms-and-conditions", label: "Terms and conditions" },
  { to: "/updates", label: "Updates" },
];

export function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="px-5 md:px-10 lg:px-18">
      <nav className="relative flex h-20 items-center justify-between text-foreground md:h-24">
        <div className="hidden items-center w-full gap-8 lg:flex lg:justify-between align-center">
          <div >
            <Link
              to="/"
              className="flex items-center gap-3"
              aria-label="Go to homepage"
            >
              <img src="/favicon.svg" alt="Followoo logo" width={32} height={32} />
              <h3 className="font-semibold">Followoo</h3>
            </Link>
          </div>
          <div className="flex items-center gap-8">
            <Link
              to="/instructions-to-start"
              className="font-semibold text-foreground transition-colors hover:text-primary"
            >
              How to start
            </Link>

            <Link
              to="/get-started"
              className="font-semibold text-foreground transition-colors hover:text-primary"
            >
              Analyze your export
            </Link>

            <Link
              to="/terms-and-conditions"
              className="font-semibold text-foreground transition-colors hover:text-primary"
            >
              Terms and conditions
            </Link>
          </div>

          <div className="flex flex-row items-center">
            <Link
              to="/updates"
              className="font-semibold text-foreground transition-colors hover:text-primary"
            >
              Updates
            </Link>
          </div>

        </div>

        {/* Mobile menu button */}

        <Link
          to="/"
          className="flex items-center gap-3 lg:hidden"
          aria-label="Go to homepage"
        >
          <img src="/favicon.svg" alt="Followoo logo" width={32} height={32} />
        </Link>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-foreground transition-colors hover:bg-white/5 lg:hidden"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <Icon
            name={isMenuOpen ? "close" : "menu"}
            color="foreground"
            width={24}
            height={24}
          />
        </button>

        <div
          id="mobile-navigation"
          className={clsx(
            "absolute left-0 top-full z-50 w-full overflow-hidden rounded-2xl border border-white/10 bg-background/95 shadow-lg backdrop-blur-md transition-all duration-300 lg:hidden",
            isMenuOpen
              ? "pointer-events-auto mt-2 opacity-100"
              : "pointer-events-none mt-0 opacity-0",
          )}
        >
          <div className="flex flex-col p-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-xl px-4 py-3 font-semibold text-foreground transition-colors hover:bg-white/5 hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}