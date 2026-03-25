import { gsap } from "gsap";
import { useLayoutEffect, useRef } from "react";
import { Callout } from "../ui/Callout";
import { Container } from "../ui/Container";
import { NavBar } from "../ui/NavBar";

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

function TermsSection({ title, children }: SectionProps) {
  return (
    <section className="text-foreground w-full">
      <h2 className="l1-b">{title}</h2>
      <p className="p1-r mt-2">{children}</p>
    </section>
  );
}

export function TermsAndConditions() {
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
            Terms and Conditions
          </h1>

          <p
            data-animate="hero-item"
            className="text-foreground/70 mt-3 text-sm"
          >
            Last updated: March 2026
          </p>

          <div data-animate="hero-item" className="mt-8 w-full">
            <Callout variant="info" title="Privacy notice">
              This application runs entirely in the user&apos;s browser and does
              not transmit personal data to external servers. Uploaded Instagram
              export files are processed locally and are not stored by the
              platform.
            </Callout>
          </div>

          <div className="mt-10 flex w-full flex-col gap-8">
            <div data-animate="hero-item">
              <TermsSection title="1. Introduction">
                This platform allows users to view and analyze data related to
                their Instagram account using files exported through the
                official tools provided by Meta. By accessing or using this
                service, the user agrees to comply with and be bound by these
                Terms and Conditions. The service operates exclusively on files
                voluntarily provided by the user and does not require direct
                access to the user&apos;s Instagram account.
              </TermsSection>
            </div>

            <div data-animate="hero-item">
              <TermsSection title="2. Source of Data">
                To use the platform&apos;s features, users must obtain their
                Instagram data through the official export tools provided by
                Meta, such as the Meta Accounts Center. The platform does not
                provide or facilitate unauthorized access to third-party data.
                All files used within the service must originate from legitimate
                and official data export procedures.
              </TermsSection>
            </div>

            <div data-animate="hero-item">
              <TermsSection title="3. Service Functionality">
                The platform allows users to analyze Instagram export files,
                view relationship-based metrics such as mutuals, followers,
                unfollowers, recent unfollowers, and blocked accounts, and
                generate results based solely on the files uploaded by the user.
                Any result depends entirely on the completeness and accuracy of
                the exported files.
              </TermsSection>
            </div>

            <div data-animate="hero-item">
              <TermsSection title="4. File and Data Handling">
                The platform does not store, save, or archive uploaded files or
                personal information. All analysis operations are performed
                temporarily for the sole purpose of generating the requested
                results. Once the operation is completed, the platform does not
                retain any history of previous analyses, and each new analysis
                requires the user to upload the relevant files again.
              </TermsSection>
            </div>

            <div data-animate="hero-item">
              <TermsSection title="5. Data Processing and Privacy">
                All uploaded files are processed locally within the user&apos;s
                browser. The platform does not upload, store, or transmit any
                personal data to external servers. All analysis is performed
                temporarily during the user session, and the files are discarded
                once the analysis is completed or the session is closed. Users
                remain fully responsible for the files they upload and for
                ensuring they do not process data belonging to third parties
                without authorization.
              </TermsSection>
            </div>

            <div data-animate="hero-item">
              <TermsSection title="6. Data Updates">
                The platform does not automatically update user data. If the
                user wants updated results, they must download a new dataset
                using the official Meta export process and upload it again to
                the platform. Maintaining up-to-date datasets is entirely the
                responsibility of the user.
              </TermsSection>
            </div>

            <div data-animate="hero-item">
              <TermsSection title="7. User Responsibility">
                Users are solely responsible for the files they upload to the
                platform. The service is intended only for analyzing personal
                data exported from the user&apos;s own Instagram account through
                official export tools. The platform must not be used to process
                data obtained without authorization.
              </TermsSection>
            </div>

            <div data-animate="hero-item">
              <TermsSection title="8. Limitation of Liability">
                This service is provided as a support tool for analyzing data
                exported by the user. The results generated depend entirely on
                the files uploaded and on their accuracy or completeness. The
                platform does not guarantee absolute accuracy of the generated
                results and shall not be held responsible for any incorrect
                interpretation, decision, or use of the data produced by the
                service.
              </TermsSection>
            </div>

            <div data-animate="hero-item">
              <TermsSection title="9. Independence from Instagram and Meta">
                This service is an independent tool and is not affiliated with,
                endorsed by, or associated with Instagram, Meta Platforms Inc.,
                or any of their subsidiaries. Instagram and Meta are registered
                trademarks of Meta Platforms Inc. All trademarks, logos, and
                brand names mentioned belong to their respective owners.
              </TermsSection>
            </div>

            <div data-animate="hero-item">
              <TermsSection title="10. Changes to the Terms">
                The platform owner reserves the right to modify these Terms and
                Conditions at any time. Any changes will become effective upon
                publication on the platform.
              </TermsSection>
            </div>

            <div data-animate="hero-item">
              <TermsSection title="11. Acceptance of Terms">
                By using this platform, the user confirms that they have read,
                understood, and agreed to these Terms and Conditions.
              </TermsSection>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
