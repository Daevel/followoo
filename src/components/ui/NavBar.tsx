import clsx from "clsx";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Icon } from "./Icon";

const navLinks = [
  { to: "/", label: "Home" },
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

  const isActiveLink = (to: string) => location.pathname === to;

  return (
    <header className="px-5 md:px-10 lg:px-18">
      <nav
        id="navbar-inner"
        className="text-foreground relative flex h-20 items-center justify-between md:h-24"
      >
        <div
          id="navbar-left"
          className="align-center hidden w-full items-center gap-8 lg:flex"
        >
          <div>
            <Link
              to="/"
              className="flex items-center gap-3"
              aria-label="Go to homepage"
            >
              <img
                src="/favicon.svg"
                alt="Followoo logo"
                width={32}
                height={32}
              />
              <h3 className="font-semibold">Followoo</h3>
            </Link>
          </div>

          <div className="flex items-center gap-8">
            {navLinks
              .filter((link) => link.to !== "/updates")
              .map((link) => {
                const isActive = isActiveLink(link.to);

                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    state={
                      link.to === "/get-started" ? { isDemo: false } : undefined
                    }
                    className={clsx(
                      "relative inline-flex items-center py-1 font-semibold transition-colors",
                      isActive
                        ? "text-foreground"
                        : "text-foreground/50 hover:text-foreground",
                    )}
                  >
                    {link.label}
                    <span
                      className={clsx(
                        "bg-foreground absolute -bottom-1 left-0 h-px w-full rounded-full transition-opacity",
                        isActive ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </Link>
                );
              })}
          </div>
        </div>

        <div
          id="navbar-right"
          className="align-center hidden flex-row items-center lg:flex"
        >
          <Link
            to="/updates"
            className={clsx(
              "relative inline-flex items-center py-1 font-semibold transition-colors",
              isActiveLink("/updates")
                ? "text-foreground"
                : "text-foreground/50 hover:text-foreground",
            )}
          >
            Updates
            <span
              className={clsx(
                "bg-foreground absolute -bottom-1 left-0 h-px w-full rounded-full transition-opacity",
                isActiveLink("/updates") ? "opacity-100" : "opacity-0",
              )}
            />
          </Link>
        </div>

        <Link
          to="/"
          className="flex items-center gap-3 lg:hidden"
          aria-label="Go to homepage"
        >
          <img src="/favicon.svg" alt="Followoo logo" width={32} height={32} />
        </Link>

        <button
          type="button"
          className="bg-bg border-primary text-foreground/50 inline-flex items-center justify-center rounded-md border p-2 transition-colors hover:bg-white/5 lg:hidden"
          aria-label={
            isMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
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
            "bg-background/95 absolute top-full left-0 z-50 w-full overflow-hidden rounded-[10px] border border-white/10 shadow-lg backdrop-blur-md transition-all duration-300 lg:hidden",
            isMenuOpen
              ? "pointer-events-auto mt-2 opacity-100"
              : "pointer-events-none mt-0 opacity-0",
          )}
        >
          <div className="flex flex-col p-3">
            {navLinks.map((link) => {
              const isActive = isActiveLink(link.to);

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={clsx(
                    "rounded-[10px] px-4 py-3 font-semibold transition-colors hover:bg-white/5",
                    isActive
                      ? "text-foreground"
                      : "text-foreground/50 hover:text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
}
