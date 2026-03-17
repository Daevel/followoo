import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { Container } from "../ui/Container";
import { NavBar } from "../ui/NavBar";
import { FooterSignature } from "../ui/FooterSignature";
import { BadgeVersion } from "../ui/BadgeVersion";
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
    <section className="w-full text-foreground">
      <div className="flex flex-row gap-3 items-center">
        <h2 className="l1-b">{title}</h2>
        <BadgeVersion
          version={badgeVersion}
          backgroundColor={badgeBackgroundColor}
        />
      </div>
      <div className="flex">
        <span className="text-sm text-foreground/80 mt-3">{releaseDate}</span>
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
    <section className="min-h-svh flex flex-col">
      <Container className="min-h-svh flex flex-col">
        <NavBar showHelp={true} />
        <div
          ref={rootRef}
          className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-start pt-16 pb-10"
        >
          <h1
            data-animate="hero-item"
            className="text-4xl font-semibold leading-headers text-foreground md:text-5xl"
          >
            Followoo updates
          </h1>

          <p data-animate="hero-item" className="mt-3 text-foreground/70">
            Here you can find the latest improvements and features added to
            Followoo.
          </p>

          <div className="mt-10 flex w-full flex-col gap-8">
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

                <p className="font-medium mt-4 text-accent/80">New</p>

                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>Added a responsive toast notification system</li>
                  <li>Added new sections for Close Friends, Restricted Users, and Hidden Stories</li>
                  <li>Added an Updates page to track product changes</li>
                </ul>

                <p className="font-medium mt-4 text-accent/80">Improvements</p>

                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>Improved Instagram export parsing with stronger TypeScript typing</li>
                  <li>Improved support for wrapped relationship files such as following and recently unfollowed users</li>
                  <li>Improved mobile UX for notifications and feedback messages</li>
                </ul>

                <p className="font-medium mt-4 text-primary/80">Fixed</p>

                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>Fixed client-side routing issues on Vercel</li>
                  <li>Fixed edge cases in username extraction from Instagram exports</li>
                  <li>Fixed duplicate user handling in parsed results</li>
                </ul>
              </UpdateSection>
            </div>

            <Separator variant="foreground"/>

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

        <FooterSignature />
      </Container>
    </section>
  );
}
