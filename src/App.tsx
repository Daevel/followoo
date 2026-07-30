import { useRef } from "react";
import Seo from "@/components/ui/Seo";
import { FeaturesSection } from "@/features/landing/components/FeatureSection";
import { HeroSection } from "@/features/landing/components/HeroSection";
import { PrivacySection } from "@/features/landing/components/PrivacySection";
import { faqCards, Questions } from "@/features/landing/components/Questions";
import { useLandingPageAnimations } from "./animations/pages/useLandingPageAnimations";
import { FooterSignature } from "./components/ui/FooterSignature";
import { NavBar } from "./components/ui/NavBar";

const SITE_URL = "https://followoo.app";

const homeSchemaMarkup = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "Followoo",
      url: SITE_URL,
      description:
        "Privacy-first web app for analyzing Instagram followers, following and unfollowers from official export files.",
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#app`,
      name: "Followoo",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web browser",
      url: SITE_URL,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      description:
        "Analyze your official Instagram export locally in your browser to compare followers, following, mutuals and unfollowers without an Instagram login.",
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: faqCards.map((card) => ({
        "@type": "Question",
        name: card.title,
        acceptedAnswer: {
          "@type": "Answer",
          text: card.description,
        },
      })),
    },
  ],
};

export default function App() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useLandingPageAnimations(rootRef);

  return (
    <div ref={rootRef} className="bg-background w-full min-h-screen">
      <Seo
        title="Followoo - Private Instagram Followers Analyzer"
        description="Analyze your Instagram export locally in your browser. Compare followers, following, mutuals and unfollowers without login or server-side file uploads."
        image={`${SITE_URL}/icons/OG.png`}
        canonical={SITE_URL}
        schemaMarkup={homeSchemaMarkup}
      />
      <NavBar />

      <section className="text-foreground px-5">
        <HeroSection />
        <FeaturesSection />
      </section>

      <PrivacySection />
      <Questions />

      <section
        data-section="footer-signature"
        className="bg-background text-foreground relative h-180 overflow-hidden px-18 pt-10 lg:h-130"
      >
        <div data-animate="footer-signature">
          <FooterSignature />
        </div>

        <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[38%]">
          <div
            data-animate="footer-brand"
            className="text-foreground text-[120px] leading-none font-semibold whitespace-nowrap md:text-[180px] lg:text-[220px]"
          >
            Followoo
          </div>
        </div>
      </section>
    </div>
  );
}
