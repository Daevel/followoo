import { useStandardPageAnimation } from "@/animations/pages/useStandardPageAnimation";
import { useRef } from "react";
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

  useStandardPageAnimation(rootRef);

  return (
    <section className="flex min-h-svh flex-col">
      <NavBar />

      <Container className="flex min-h-svh flex-col">
        <div
          ref={rootRef}
          className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-start pt-16 pb-10"
        >
          <h1
            data-page-animate="heading"
            className="leading-headers text-foreground text-4xl font-semibold md:text-5xl"
          >
            Terms and Conditions
          </h1>

          <p
            data-page-animate="subheading"
            className="text-foreground/70 mt-3 text-sm"
          >
            Last updated: April 2026
          </p>

          <div
            data-page-animate="content"
            className="mt-10 flex w-full flex-col gap-8"
          >
            <div data-page-animate="item">
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

            <div data-page-animate="item">
              <TermsSection title="2. Source of Data">
                To use the platform&apos;s features, users must obtain their
                Instagram data through the official export tools provided by
                Meta, such as the Meta Accounts Center. The platform does not
                provide or facilitate unauthorized access to third-party data.
                All files used within the service must originate from legitimate
                and official data export procedures.
              </TermsSection>
            </div>

            <div data-page-animate="item">
              <TermsSection title="3. Service Functionality">
                The platform allows users to analyze Instagram export files and
                generate relationship-based results, such as mutuals, followers,
                unfollowers, recent unfollowers, and similar account insights.
                Any result depends entirely on the completeness and accuracy of
                the files provided by the user.
              </TermsSection>
            </div>

            <div data-page-animate="item">
              <TermsSection title="4. Permitted Use">
                This service is intended only for analyzing data exported from
                the user&apos;s own Instagram account through official export
                tools. The platform must not be used to process data obtained
                without authorization, to access third-party data unlawfully, or
                for any purpose that violates applicable law or the rights of
                others.
              </TermsSection>
            </div>

            <div data-page-animate="item">
              <TermsSection title="5. User Responsibility">
                Users are solely responsible for the files they upload and for
                ensuring that they have the right to use those files with the
                platform. Users are also responsible for verifying that the
                exported data is up to date if they want current results.
              </TermsSection>
            </div>

            <div data-page-animate="item">
              <TermsSection title="6. Data Updates">
                The platform does not automatically update user data. If the
                user wants updated results, they must download a new dataset
                using the official Meta export process and upload it again.
              </TermsSection>
            </div>

            <div data-page-animate="item">
              <TermsSection title="7. Availability of the Service">
                The service may be modified, suspended, or discontinued at any
                time, with or without notice. No guarantee is given that the
                platform will remain available, uninterrupted, or error-free at
                all times.
              </TermsSection>
            </div>

            <div data-page-animate="item">
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

            <div data-page-animate="item">
              <TermsSection title="9. No Affiliation with Instagram or Meta">
                This service is an independent tool and is not affiliated with,
                endorsed by, or associated with Instagram, Meta Platforms Inc.,
                or any of their subsidiaries. Instagram and Meta are registered
                trademarks of Meta Platforms Inc. All trademarks, logos, and
                brand names mentioned belong to their respective owners.
              </TermsSection>
            </div>

            <div data-page-animate="item">
              <TermsSection title="10. Eligibility">
                By using this platform, the user confirms that they are legally
                permitted to accept these Terms under the laws applicable in
                their jurisdiction.
              </TermsSection>
            </div>

            <div data-page-animate="item">
              <TermsSection title="11. Changes to the Terms">
                The platform owner reserves the right to modify these Terms and
                Conditions at any time. Any changes will become effective upon
                publication on the platform. Continued use of the service after
                such changes have been published constitutes acceptance of the
                updated Terms.
              </TermsSection>
            </div>

            <div data-page-animate="item">
              <TermsSection title="12. Governing Law">
                These Terms and Conditions are governed by the laws of Italy,
                unless otherwise required by applicable consumer protection
                laws. Any dispute arising out of or in connection with these
                Terms shall be subject to the competent courts of Italy, unless
                otherwise required by applicable law.
              </TermsSection>
            </div>

            <div data-page-animate="item">
              <TermsSection title="13. Contact">
                For any questions regarding these Terms and Conditions, users
                may contact the platform owner at:{" "}
                <a
                  href="mailto:luigi.avitabile5@gmail.com"
                  className="text-accent underline underline-offset-2"
                >
                  luigi.avitabile5@gmail.com
                </a>
              </TermsSection>
            </div>

            <div data-page-animate="item">
              <TermsSection title="14. Acceptance of Terms">
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
