import { useRef } from "react";
import { useStandardPageAnimation } from "@/animations/pages/useStandardPageAnimation";
import { Container } from "@/components/ui/Container";
import { NavBar } from "@/components/ui/NavBar";
import Seo from "@/components/ui/Seo";
import {
  LegalDocument,
  type LegalSection,
  type LegalSummaryPoint,
} from "@/features/legal/components/LegalDocument";

const summary: LegalSummaryPoint[] = [
  {
    icon: "download",
    title: "Your official export only",
    description:
      "Followoo works on files you download from Instagram yourself.",
  },
  {
    icon: "linkOff",
    title: "Not affiliated with Meta",
    description: "Followoo is independent from Instagram and Meta.",
  },
  {
    icon: "shield",
    title: "Provided as is",
    description: "Results depend on your export; use them responsibly.",
  },
];

const sections: LegalSection[] = [
  {
    id: "introduction",
    title: "Introduction",
    body: "This platform allows users to view and analyze data related to their Instagram account using files exported through the official tools provided by Meta. By accessing or using this service, the user agrees to comply with and be bound by these Terms and Conditions. The service operates exclusively on files voluntarily provided by the user and does not require direct access to the user's Instagram account.",
  },
  {
    id: "source-of-data",
    title: "Source of Data",
    body: "To use the platform's features, users must obtain their Instagram data through the official export tools provided by Meta, such as the Meta Accounts Center. The platform does not provide or facilitate unauthorized access to third-party data. All files used within the service must originate from legitimate and official data export procedures.",
  },
  {
    id: "service-functionality",
    title: "Service Functionality",
    body: "The platform allows users to analyze Instagram export files and generate relationship-based results, such as mutuals, followers, unfollowers, recent unfollowers, and similar account insights. Any result depends entirely on the completeness and accuracy of the files provided by the user.",
  },
  {
    id: "permitted-use",
    title: "Permitted Use",
    body: "This service is intended only for analyzing data exported from the user's own Instagram account through official export tools. The platform must not be used to process data obtained without authorization, to access third-party data unlawfully, or for any purpose that violates applicable law or the rights of others.",
  },
  {
    id: "user-responsibility",
    title: "User Responsibility",
    body: "Users are solely responsible for the files they upload and for ensuring that they have the right to use those files with the platform. Users are also responsible for verifying that the exported data is up to date if they want current results.",
  },
  {
    id: "data-updates",
    title: "Data Updates",
    body: "The platform does not automatically update user data. If the user wants updated results, they must download a new dataset using the official Meta export process and upload it again.",
  },
  {
    id: "availability-of-the-service",
    title: "Availability of the Service",
    body: "The service may be modified, suspended, or discontinued at any time, with or without notice. No guarantee is given that the platform will remain available, uninterrupted, or error-free at all times.",
  },
  {
    id: "limitation-of-liability",
    title: "Limitation of Liability",
    body: "This service is provided as a support tool for analyzing data exported by the user. The results generated depend entirely on the files uploaded and on their accuracy or completeness. The platform does not guarantee absolute accuracy of the generated results and shall not be held responsible for any incorrect interpretation, decision, or use of the data produced by the service.",
  },
  {
    id: "no-affiliation-with-instagram-or-meta",
    title: "No Affiliation with Instagram or Meta",
    body: "This service is an independent tool and is not affiliated with, endorsed by, or associated with Instagram, Meta Platforms Inc., or any of their subsidiaries. Instagram and Meta are registered trademarks of Meta Platforms Inc. All trademarks, logos, and brand names mentioned belong to their respective owners.",
  },
  {
    id: "eligibility",
    title: "Eligibility",
    body: "By using this platform, the user confirms that they are legally permitted to accept these Terms under the laws applicable in their jurisdiction.",
  },
  {
    id: "changes-to-the-terms",
    title: "Changes to the Terms",
    body: "The platform owner reserves the right to modify these Terms and Conditions at any time. Any changes will become effective upon publication on the platform. Continued use of the service after such changes have been published constitutes acceptance of the updated Terms.",
  },
  {
    id: "governing-law",
    title: "Governing Law",
    body: "These Terms and Conditions are governed by the laws of Italy, unless otherwise required by applicable consumer protection laws. Any dispute arising out of or in connection with these Terms shall be subject to the competent courts of Italy, unless otherwise required by applicable law.",
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <>
        For any questions regarding these Terms and Conditions, users may
        contact the platform owner at:{" "}
        <a
          href="mailto:luigi.avitabile5@gmail.com"
          className="text-brand-fg hover:underline underline-offset-2"
        >
          luigi.avitabile5@gmail.com
        </a>
      </>
    ),
  },
  {
    id: "acceptance-of-terms",
    title: "Acceptance of Terms",
    body: "By using this platform, the user confirms that they have read, understood, and agreed to these Terms and Conditions.",
  },
];

export function TermsAndConditions() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useStandardPageAnimation(rootRef);

  return (
    <section className="flex min-h-svh flex-col">
      <Seo
        title="Terms and Conditions - Followoo"
        description="Review the terms for using Followoo to analyze official Instagram export files locally in your browser."
        image="https://followoo.app/icons/OG.png"
        canonical="https://followoo.app/terms-and-conditions"
      />
      <NavBar />
      <Container size="app" className="flex flex-1 flex-col">
        <div ref={rootRef} className="flex-1">
          <LegalDocument
            title="Terms and Conditions"
            lastUpdated="April 2026"
            summary={summary}
            sections={sections}
            contactTitle="Questions about these terms?"
          />
        </div>
      </Container>
    </section>
  );
}
