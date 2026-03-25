import { gsap } from "gsap";
import { useLayoutEffect, useRef } from "react";
import { BadgeVersion } from "../ui/BadgeVersion";
import { Container } from "../ui/Container";
import { NavBar } from "../ui/NavBar";
import { Separator } from "../ui/Separator";

function UpdateSection({
  title,
  children,
  badgeVersion,
  badgeBackgroundColor,
  releaseDate,
}: {
  title: string;
  children: React.ReactNode;
  badgeVersion: string;
  badgeBackgroundColor?: string;
  releaseDate: string;
}) {
  return (
    <section className="text-foreground w-full">
      <div className="flex flex-row items-center gap-3">
        <h2 className="l1-b">{title}</h2>
        <BadgeVersion
          version={badgeVersion}
          backgroundColor={badgeBackgroundColor}
        />
      </div>
      <div className="flex">
        <span className="text-foreground/80 mt-3 text-sm">{releaseDate}</span>
      </div>
      <div className="flex">
        <div className="p1-r mt-5">{children}</div>
      </div>
    </section>
  );
}

export function Updates() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-animate='hero-item']",
        {
          opacity: 0,
          y: 24,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
        },
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="flex min-h-svh flex-col">
      <NavBar />
      <Container className="flex min-h-svh flex-col">
        <div
          ref={rootRef}
          className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-start pt-16 pb-10"
        >
          <h1
            data-animate="hero-item"
            className="leading-headers text-foreground text-4xl font-semibold md:text-5xl"
          >
            Followoo updates
          </h1>

          <p data-animate="hero-item" className="text-foreground/70 mt-3">
            Here you can find the latest improvements and features added to
            Followoo.
          </p>

          <div className="mt-10 flex w-full flex-col gap-8">
            <div data-animate="hero-item">
              <UpdateSection
                title="Followoo"
                badgeVersion="1.1.0"
                badgeBackgroundColor="accent"
                releaseDate="March 19, 2026"
              >
                <p>
                  Version 1.1.0 introduces an analytics system to track user
                  interactions and errors, providing valuable insights for
                  future improvements. The user privacy and security remain a
                  top priority, with all analytics data being anonymized and
                  used solely for improving the user experience.
                </p>

                <p className="text-accent/80 mt-4 font-medium">New</p>

                <ul className="mt-2 list-disc space-y-2 pl-5">
                  <li>
                    Added a new analytics system to track user interactions and
                    errors
                  </li>
                </ul>
              </UpdateSection>
            </div>

            <Separator variant="foreground" />

            <div data-animate="hero-item">
              <UpdateSection
                title="Followoo"
                badgeVersion="1.0.0"
                badgeBackgroundColor="accent"
                releaseDate="March 17, 2026"
              >
                <p>
                  Version 1.0.0 marks the evolution of the initial experimental
                  beta of Followoo. This release introduces several improvements
                  and new features aimed at making the platform more reliable
                  and feature-rich.
                </p>

                <p className="text-accent/80 mt-4 font-medium">New</p>

                <ul className="mt-2 list-disc space-y-2 pl-5">
                  <li>Added a responsive toast notification system</li>
                  <li>
                    Added new sections for Close Friends, Restricted Users, and
                    Hidden Stories
                  </li>
                  <li>Added an Updates page to track product changes</li>
                </ul>

                <p className="text-accent/80 mt-4 font-medium">Improvements</p>

                <ul className="mt-2 list-disc space-y-2 pl-5">
                  <li>
                    Improved Instagram export parsing with stronger TypeScript
                    typing
                  </li>
                  <li>
                    Improved support for wrapped relationship files such as
                    following and recently unfollowed users
                  </li>
                  <li>
                    Improved mobile UX for notifications and feedback messages
                  </li>
                </ul>

                <p className="text-primary/80 mt-4 font-medium">Fixed</p>

                <ul className="mt-2 list-disc space-y-2 pl-5">
                  <li>Fixed client-side routing issues on Vercel</li>
                  <li>
                    Fixed edge cases in username extraction from Instagram
                    exports
                  </li>
                  <li>Fixed duplicate user handling in parsed results</li>
                </ul>
              </UpdateSection>
            </div>

            <Separator variant="foreground" />

            <div data-animate="hero-item">
              <UpdateSection
                title="Followoo"
                badgeVersion="0.0.1"
                badgeBackgroundColor="accent"
                releaseDate="March 12, 2026"
              >
                <p>
                  First experimental beta release of Followoo. This version
                  introduced the core functionality of the platform and allowed
                  early testing of the system in real scenarios. Initial results
                  confirmed the reliability of the core features and laid the
                  foundation for future improvements.
                </p>
              </UpdateSection>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
