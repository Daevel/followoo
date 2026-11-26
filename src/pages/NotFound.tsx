import clsx from "clsx";
import { Link } from "react-router";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Mascot } from "@/components/ui/Mascot";
import { NavBar } from "@/components/ui/NavBar";
import { Orbits } from "@/components/ui/Orbits";
import Seo from "@/components/ui/Seo";
import { SiteFooter } from "@/components/ui/SiteFooter";

const moreLinks = [
  { to: "/instructions-to-start", label: "How to start" },
  { to: "/updates", label: "Updates" },
  { to: "/support", label: "Support" },
];

// Shown for any address the app doesn't know. On Vercel the prerendered
// copy is dist/404.html, served with a real 404 status (see
// scripts/prerender-static.mjs). The zero of "404" is an orbit with the
// puzzled mascot in it: turning on wide screens, still on phones.
export function NotFound() {
  return (
    <>
      <Seo
        title="Page not found - Followoo"
        description="This page doesn't exist. Go back to Followoo's home or analyze your Instagram export privately in your browser."
        image="https://followoo.app/icons/OG.png"
        canonical="https://followoo.app/"
        noIndex
      />
      <section className="flex min-h-svh flex-col">
        <NavBar />

        <main className="flex flex-1 items-center justify-center px-5 pt-8 pb-16 sm:pt-10 sm:pb-20">
          <div className="flex max-w-[560px] flex-col items-center text-center">
            <p
              aria-hidden="true"
              className="text-fg flex items-center gap-1 text-[92px] leading-none font-semibold tracking-[-0.06em] sm:gap-2.5 sm:text-[150px]"
            >
              <span>4</span>
              <span className="relative inline-flex size-[120px] items-center justify-center sm:size-[176px]">
                <Orbits
                  size={120}
                  dotScale={1.2}
                  spinning={false}
                  className="absolute inset-0 sm:hidden"
                />
                <Orbits
                  size={176}
                  className="absolute inset-0 hidden sm:block"
                />
                <Mascot
                  pose="oops"
                  size={104}
                  className="relative size-[70px] sm:size-[104px]"
                />
              </span>
              <span>4</span>
            </p>

            <p className="text-brand-fg mt-5 text-[13px] font-medium sm:mt-7">
              Page not found
            </p>
            <h1 className="text-fg mt-2 text-[30px] leading-tight font-semibold tracking-[-0.025em] text-balance sm:text-[40px]">
              This page vanished into thin air.
            </h1>
            <p className="text-fg-muted mt-3.5 max-w-[440px] text-[15px] leading-relaxed sm:text-base">
              The link may be old or mistyped. Nothing to worry about: your data
              never leaves your device, so nothing is lost.
            </p>

            <div className="mt-7 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                to="/"
                className={buttonClasses({ variant: "primary", size: "lg" })}
              >
                Back to home
                <Icon
                  name="arrowRight"
                  color="current"
                  width={16}
                  height={16}
                  aria-hidden="true"
                />
              </Link>
              <Link
                to="/get-started"
                className={buttonClasses({ variant: "secondary", size: "lg" })}
              >
                Analyze your export
              </Link>
            </div>

            <nav
              aria-label="Other pages"
              className="text-fg-faint mt-6 text-[13px]"
            >
              Or go to{" "}
              {moreLinks.map((link, index) => (
                <span key={link.to}>
                  {index > 0 && " · "}
                  <Link
                    to={link.to}
                    className={clsx(
                      "text-brand-fg rounded-sm hover:underline focus-visible:shadow-ring focus-visible:outline-none"
                    )}
                  >
                    {link.label}
                  </Link>
                </span>
              ))}
            </nav>
          </div>
        </main>

        <SiteFooter />
      </section>
    </>
  );
}
