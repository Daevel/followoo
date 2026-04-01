import { useStandardPageAnimation } from "@/animations/pages/useStandardPageAnimation";
import { useRef } from "react";
import { Callout } from "../ui/Callout";
import { Container } from "../ui/Container";
import { NavBar } from "../ui/NavBar";

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

function PrivacySection({ title, children }: SectionProps) {
  return (
    <section className="text-foreground w-full">
      <h2 className="l1-b">{title}</h2>
      <p className="p1-r mt-2">{children}</p>
    </section>
  );
}

export function PrivacyPolicy() {
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
            Privacy Policy
          </h1>

          <p
            data-page-animate="subheading"
            className="text-foreground/70 mt-3 text-sm"
          >
            Last updated: April 2026
          </p>

          <div data-page-animate="callout" className="mt-8 w-full">
            <Callout variant="info" title="Privacy summary">
              Instagram export files uploaded to this application are processed
              locally in the browser and are not uploaded to or stored on
              external servers. The website may collect limited,
              privacy-friendly usage metrics to understand product performance
              and improve the service, but these metrics are separate from the
              contents of uploaded Instagram files.
            </Callout>
          </div>

          <div
            data-page-animate="content"
            className="mt-10 flex w-full flex-col gap-8"
          >
            <div data-page-animate="item">
              <PrivacySection title="1. Introduction">
                This Privacy Policy explains how this platform handles
                information when users access and use the service. The platform
                is designed to analyze Instagram export files locally in the
                user&apos;s browser, without requiring direct access to the
                user&apos;s Instagram account.
              </PrivacySection>
            </div>

            <div data-page-animate="item">
              <PrivacySection title="2. Data Provided by the User">
                To use the service, users may upload Instagram export files that
                they have obtained through the official export tools provided by
                Meta. These files may contain personal information related to
                the user&apos;s Instagram account, including account
                relationships such as followers and following.
              </PrivacySection>
            </div>

            <div data-page-animate="item">
              <PrivacySection title="3. How Uploaded Files Are Processed">
                Uploaded Instagram export files are processed locally within the
                user&apos;s browser. The contents of those files are not
                uploaded to, transmitted to, or stored on external servers for
                analysis. The analysis is performed only for the purpose of
                generating the results requested by the user during the active
                session.
              </PrivacySection>
            </div>

            <div data-page-animate="item">
              <PrivacySection title="4. File Storage and Retention">
                The platform does not store, archive, or retain uploaded
                Instagram export files after use. Once the analysis is completed
                or the session ends, the uploaded files are no longer processed
                by the service. Users must upload the files again if they want
                to perform a new analysis in a future session.
              </PrivacySection>
            </div>

            <div data-page-animate="item">
              <PrivacySection title="5. Website Usage Metrics">
                The website may use privacy-friendly analytics tools to measure
                product usage, monitor performance, and improve the service.
                These metrics are limited to general website or product usage
                information and are not used to read, inspect, or process the
                contents of uploaded Instagram export files. Uploaded files and
                analytics data are handled separately.
              </PrivacySection>
            </div>

            <div data-page-animate="item">
              <PrivacySection title="6. Purpose of Processing">
                Uploaded Instagram export files are processed solely to generate
                the requested relationship-based insights for the user. Website
                usage metrics, where collected, are used only to understand
                product performance, improve usability, and monitor the
                reliability of the service.
              </PrivacySection>
            </div>

            <div data-page-animate="item">
              <PrivacySection title="7. Data Sharing">
                The platform does not sell uploaded Instagram export files and
                does not share their contents with third parties for marketing
                or advertising purposes. Any privacy-friendly analytics provider
                used for website metrics receives only the limited information
                necessary to provide those metrics and does not receive the
                contents of uploaded Instagram export files.
              </PrivacySection>
            </div>

            <div data-page-animate="item">
              <PrivacySection title="8. User Responsibility">
                Users remain responsible for the files they choose to upload and
                for ensuring that they are authorized to process any data
                contained in those files. The service is intended for personal
                use with data exported from the user&apos;s own Instagram
                account through official tools.
              </PrivacySection>
            </div>

            <div data-page-animate="item">
              <PrivacySection title="9. Data Security">
                The platform is designed to minimize data exposure by processing
                uploaded Instagram files locally in the browser rather than on
                external servers. However, no website or software tool can
                guarantee absolute security, and users remain responsible for
                using the platform in a secure environment and on trusted
                devices.
              </PrivacySection>
            </div>

            <div data-page-animate="item">
              <PrivacySection title="10. International Users">
                If users access the service from outside the country where the
                platform owner is based, they do so on their own initiative and
                are responsible for compliance with any local laws that may
                apply to their use of the service.
              </PrivacySection>
            </div>

            <div data-page-animate="item">
              <PrivacySection title="11. Changes to this Privacy Policy">
                This Privacy Policy may be updated from time to time to reflect
                changes to the service or applicable legal requirements. Any
                updates become effective when published on the platform.
              </PrivacySection>
            </div>

            <div data-page-animate="item">
              <PrivacySection title="12. Contact">
                For any privacy-related questions, users may contact the
                platform owner at:{" "}
                <a
                  href="mailto:luigi.avitabile5@gmail.com"
                  className="text-accent underline underline-offset-2"
                >
                  luigi.avitabile5@gmail.com
                </a>
              </PrivacySection>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
