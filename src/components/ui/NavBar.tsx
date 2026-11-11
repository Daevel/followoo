import { Show, SignInButton, UserButton, useAuth } from "@clerk/react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { useFeatureFlag } from "@/analytics";
import { SYNC_FEATURE_FLAG_KEY } from "@/features/sync/constants";
import { Button } from "./Button";
import { FabIcon } from "./FabIcon";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/instructions-to-start", label: "How to start" },
  { to: "/get-started", label: "Analyze your export" },
  { to: "/support", label: "Support" },
  { to: "/updates", label: "Updates" },
];

const historyLink = { to: "/history", label: "History" };

function NavAuthEntry() {
  return (
    <Show
      when="signed-in"
      fallback={
        <SignInButton mode="modal">
          <Button variant="ghost" size="sm">
            Sign in
          </Button>
        </SignInButton>
      }
    >
      <UserButton />
    </Show>
  );
}

// Active link sits on a faint pill; everything else stays muted.
function navLinkClass(isActive: boolean, size: "desktop" | "mobile") {
  return clsx(
    "rounded-lg font-medium transition-colors focus-visible:shadow-ring focus-visible:outline-none",
    size === "desktop" ? "px-2.5 py-1.5 text-sm" : "px-3 py-2.5 text-[15px]",
    isActive ? "bg-line-subtle text-fg" : "text-fg-muted hover:text-fg"
  );
}

type NavBarProps = {
  /** Pins the bar to the top with a translucent background (homepage). */
  sticky?: boolean;
  /** Primary action shown in the bar only while `showCta` is true. */
  cta?: { label: string; onClick: () => void };
  showCta?: boolean;
};

export function NavBar({ sticky = false, cta, showCta = false }: NavBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let abortController: AbortController | null = null;
    const runEffect = () => {
      setIsMenuOpen(false);
    };

    abortController = new AbortController();
    void runEffect();

    return () => {
      abortController?.abort();
    };
  }, []);

  const isActiveLink = (to: string) => location.pathname === to;

  // History is only for signed-in users with encrypted history enabled;
  // it sits right before Updates.
  const { isSignedIn } = useAuth();
  const isSyncEnabled = useFeatureFlag(SYNC_FEATURE_FLAG_KEY, false);
  const links =
    isSignedIn && isSyncEnabled
      ? navLinks.flatMap((link) =>
          link.to === "/updates" ? [historyLink, link] : [link]
        )
      : navLinks;

  return (
    <header
      className={clsx(
        "px-5 pt-[env(safe-area-inset-top)] md:px-10 lg:px-18",
        sticky &&
          "border-line-subtle bg-surface-0/80 sticky top-0 z-40 border-b backdrop-blur-md"
      )}
    >
      <nav
        id="navbar-inner"
        className="text-fg relative flex h-16 items-center justify-between md:h-20"
      >
        <div
          id="navbar-left"
          className="hidden w-full items-center gap-6 lg:flex"
        >
          <Link
            to="/"
            className="focus-visible:shadow-ring flex items-center gap-2.5 rounded-lg focus-visible:outline-none"
            aria-label="Go to homepage"
          >
            <img src="/favicon.svg" alt="" width={24} height={24} />
            <span className="text-[15px] font-semibold tracking-[-0.01em]">
              Followoo
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {links
              .filter((link) => link.to !== "/updates")
              .map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  state={
                    link.to === "/get-started" ? { isDemo: false } : undefined
                  }
                  aria-current={isActiveLink(link.to) ? "page" : undefined}
                  className={navLinkClass(isActiveLink(link.to), "desktop")}
                >
                  {link.label}
                </Link>
              ))}
          </div>
        </div>

        <div
          id="navbar-right"
          className="hidden shrink-0 flex-row items-center gap-3 lg:flex"
        >
          <Link
            to="/updates"
            aria-current={isActiveLink("/updates") ? "page" : undefined}
            className={navLinkClass(isActiveLink("/updates"), "desktop")}
          >
            Updates
          </Link>
          <NavAuthEntry />
          {cta && <NavCta cta={cta} visible={showCta} />}
        </div>

        <Link
          to="/"
          className="focus-visible:shadow-ring flex items-center gap-2.5 rounded-lg focus-visible:outline-none lg:hidden"
          aria-label="Go to homepage"
        >
          <img src="/favicon.svg" alt="" width={24} height={24} />
          <span className="text-[15px] font-semibold tracking-[-0.01em]">
            Followoo
          </span>
        </Link>

        {cta && (
          <div className="ml-auto pr-2 lg:hidden">
            <NavCta cta={cta} visible={showCta} />
          </div>
        )}

        <FabIcon
          icon={isMenuOpen ? "close" : "menu"}
          variant="ghost"
          className="lg:hidden"
          aria-label={
            isMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        />

        <div
          id="mobile-navigation"
          inert={!isMenuOpen}
          className={clsx(
            "border-line-strong bg-surface-2 shadow-elev-2 absolute top-full left-0 z-50 w-full overflow-hidden rounded-card border transition-all duration-300 lg:hidden",
            isMenuOpen
              ? "pointer-events-auto mt-2 opacity-100"
              : "pointer-events-none mt-0 opacity-0"
          )}
        >
          <div className="flex flex-col gap-0.5 p-2">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                aria-current={isActiveLink(link.to) ? "page" : undefined}
                className={navLinkClass(isActiveLink(link.to), "mobile")}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-line-subtle mt-1.5 border-t px-1 pt-2.5 pb-1">
              <NavAuthEntry />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

// Fades in once the page's own primary action has scrolled away, so there is
// never more than one primary CTA on screen.
function NavCta({
  cta,
  visible,
}: {
  cta: { label: string; onClick: () => void };
  visible: boolean;
}) {
  return (
    <div
      inert={!visible}
      className={clsx(
        "transition-opacity duration-200",
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <Button size="sm" onClick={cta.onClick}>
        {cta.label}
      </Button>
    </div>
  );
}
