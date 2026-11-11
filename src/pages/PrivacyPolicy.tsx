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
    icon: "laptop",
    title: "Your export stays on your device",
    description: "It is analyzed in your browser and never uploaded.",
  },
  {
    icon: "userCheck",
    title: "A Followoo account, not your Instagram",
    description:
      "After your first analysis a free account is needed; only its basic details are stored.",
  },
  {
    icon: "eye",
    title: "Limited, separate metrics",
    description:
      "Usage and error data never include your export or your results.",
  },
];

const sections: LegalSection[] = [
  {
    id: "introduction",
    title: "Introduction",
    body: "This Privacy Policy explains how this platform handles information when users access and use the service. The platform is designed to analyze Instagram export files locally in the user's browser, without requiring direct access to the user's Instagram account.",
  },
  {
    id: "data-provided-by-the-user",
    title: "Data Provided by the User",
    body: "To use the service, users may upload Instagram export files that they have obtained through the official export tools provided by Meta. These files may contain personal information related to the user's Instagram account, including account relationships such as followers and following.",
  },
  {
    id: "how-uploaded-files-are-processed",
    title: "How Uploaded Files Are Processed",
    body: "Uploaded Instagram export files are processed locally within the user's browser. The contents of those files are not uploaded to, transmitted to, or stored on external servers for analysis. The analysis is performed only for the purpose of generating the results requested by the user during the active session.",
  },
  {
    id: "file-storage-and-retention",
    title: "File Storage and Retention",
    body: "The platform does not store, archive, or retain uploaded Instagram export files after use. Once the analysis is completed or the session ends, the uploaded files are no longer processed by the service. Users must upload the files again if they want to perform a new analysis in a future session.",
  },
  {
    id: "followoo-account",
    title: "Followoo Account",
    body: "The first analysis does not require an account. To run further analyses, users must create a free Followoo account, signing in with an email address or a Google account through Clerk, the authentication provider used by the platform. The platform stores the account identifier and the email address associated with the account. A Followoo account is separate from the user's Instagram account: the platform never asks for Instagram credentials.",
  },
  {
    id: "usage-events",
    title: "Usage Events",
    body: "When a user is signed in, the platform records generic usage events linked to the account identifier, such as the fact that an analysis was run, to manage access to the service and understand how it is used. These events never contain the contents of uploaded Instagram export files, usernames, or analysis results.",
  },
  {
    id: "website-usage-metrics",
    title: "Website Usage Metrics",
    body: "The website uses PostHog to measure product usage, monitor performance, enable or disable features, and improve the service. These metrics are limited to general website or product usage information and are not used to read, inspect, or process the contents of uploaded Instagram export files. When a user is signed in, metrics are associated with the account identifier only, never with the email address. Uploaded files and analytics data are handled separately.",
  },
  {
    id: "error-reporting",
    title: "Error Reporting",
    body: "To detect and fix problems, the platform uses Sentry, which receives technical information about errors, such as the error type and message, the point in the code where it occurred, and basic browser and device details. Error reports are configured not to include the contents of uploaded Instagram export files or analysis results.",
  },
  {
    id: "data-stored-on-your-device",
    title: "Data Stored on Your Device",
    body: "The platform keeps a few small values in the browser's local storage, such as whether the free analysis has already been used and whether the install prompt for the app was dismissed. These values stay on the user's device and can be removed by clearing the site data in the browser.",
  },
  {
    id: "support-messages",
    title: "Support Messages",
    body: "When a user writes through the support form, the name, email address, and message are sent through EmailJS to the platform owner's inbox, only to answer the request.",
  },
  {
    id: "purpose-of-processing",
    title: "Purpose of Processing",
    body: "Uploaded Instagram export files are processed solely to generate the requested relationship-based insights for the user. Account data is used to provide access to the service, usage metrics and usage events to understand product performance, improve usability, and monitor the reliability of the service, error reports to fix problems, and support messages to answer the user.",
  },
  {
    id: "data-sharing",
    title: "Data Sharing",
    body: "The platform does not sell uploaded Instagram export files or personal data and does not share them with third parties for marketing or advertising purposes. The service relies on providers that process limited data on its behalf: Clerk (authentication), PostHog (usage metrics), Sentry (error reporting), EmailJS (support messages), and the hosting providers of the website and of the account database. None of them receives the contents of uploaded Instagram export files.",
  },
  {
    id: "account-data-retention-and-deletion",
    title: "Account Data Retention and Deletion",
    body: "Account data and usage events are kept for as long as the account exists. Users can ask for their account and the associated data to be deleted at any time by contacting the platform owner.",
  },
  {
    id: "user-responsibility",
    title: "User Responsibility",
    body: "Users remain responsible for the files they choose to upload and for ensuring that they are authorized to process any data contained in those files. The service is intended for personal use with data exported from the user's own Instagram account through official tools.",
  },
  {
    id: "data-security",
    title: "Data Security",
    body: "The platform is designed to minimize data exposure by processing uploaded Instagram files locally in the browser rather than on external servers. However, no website or software tool can guarantee absolute security, and users remain responsible for using the platform in a secure environment and on trusted devices.",
  },
  {
    id: "international-users",
    title: "International Users",
    body: "If users access the service from outside the country where the platform owner is based, they do so on their own initiative and are responsible for compliance with any local laws that may apply to their use of the service.",
  },
  {
    id: "changes-to-this-privacy-policy",
    title: "Changes to this Privacy Policy",
    body: "This Privacy Policy may be updated from time to time to reflect changes to the service or applicable legal requirements. Any updates become effective when published on the platform.",
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <>
        For any privacy-related questions, users may contact the platform owner
        at:{" "}
        <a
          href="mailto:luigi.avitabile5@gmail.com"
          className="text-brand-fg underline-offset-2 hover:underline"
        >
          luigi.avitabile5@gmail.com
        </a>
      </>
    ),
  },
];

export function PrivacyPolicy() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useStandardPageAnimation(rootRef);

  return (
    <section className="flex min-h-svh flex-col">
      <Seo
        title="Privacy Policy - Followoo"
        description="Learn how Followoo protects your Instagram export data by processing files locally in your browser without uploading them to external servers."
        image="https://followoo.app/icons/OG.png"
        canonical="https://followoo.app/privacy-and-policy"
      />
      <NavBar />
      <Container size="app" className="flex flex-1 flex-col">
        <div ref={rootRef} className="flex-1">
          <LegalDocument
            title="Privacy Policy"
            lastUpdated="October 2026"
            summary={summary}
            sections={sections}
            contactTitle="Questions about your data?"
          />
        </div>
      </Container>
    </section>
  );
}
