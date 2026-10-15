import { useRef } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import Seo from "@/components/ui/Seo";
import { FeaturesSection } from "@/features/landing/components/FeatureSection";
import { HeroSection } from "@/features/landing/components/HeroSection";
import { PrivacySection } from "@/features/landing/components/PrivacySection";
import { faqCards, Questions } from "@/features/landing/components/Questions";
import { useIsInViewport } from "@/features/landing/hooks/useIsInViewport";
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
  const heroCtaRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const isHeroCtaVisible = useIsInViewport(heroCtaRef);

  useLandingPageAnimations(rootRef);

  const analyze = () => navigate("/get-started", { state: { isDemo: false } });
  const tryDemo = () => navigate("/get-started", { state: { isDemo: true } });

  return (
    <div ref={rootRef} className="bg-bg w-full min-h-screen">
      <Seo
        title="Followoo - Private Instagram Followers Analyzer"
        description="Analyze your Instagram export locally in your browser. Compare followers, following, mutuals and unfollowers without login or server-side file uploads."
        image={`${SITE_URL}/icons/OG.png`}
        canonical={SITE_URL}
        schemaMarkup={homeSchemaMarkup}
      />
      {/* the bar's CTA appears only once the hero's own actions scroll away */}
      <NavBar
        sticky
        cta={{ label: "Analyze your data", onClick: analyze }}
        showCta={!isHeroCtaVisible}
      />

      <HeroSection ctaRef={heroCtaRef} />
      <FeaturesSection />
      <PrivacySection />
      <Questions />

      <section className="pb-20 md:pb-24">
        <Container size="app">
          <div className="border-line-subtle bg-surface-1 shadow-elev-1 flex flex-col items-start justify-between gap-6 rounded-[20px] border p-8 text-start md:flex-row md:items-center md:p-12">
            <div>
              <h2 className="text-fg text-2xl leading-tight font-semibold tracking-[-0.03em] sm:text-[30px]">
                Ready to see who doesn&apos;t follow back?
              </h2>
              <p className="text-fg-muted mt-2 text-base leading-7">
                Free, no Instagram login, nothing to install.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button variant="secondary" size="lg" onClick={tryDemo}>
                Try demo
              </Button>
              <Button
                size="lg"
                icon="arrowRight"
                iconPosition="right"
                onClick={analyze}
              >
                Analyze your data
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <section
        data-section="footer-signature"
        className="border-line-subtle bg-bg text-fg relative h-180 overflow-hidden border-t px-5 pt-12 md:px-10 lg:h-130 lg:px-18"
      >
        <div data-animate="footer-signature">
          <FooterSignature />
        </div>

        <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[38%]">
          <div
            data-animate="footer-brand"
            aria-hidden="true"
            className="text-surface-2 text-[120px] leading-none font-semibold tracking-[-0.06em] whitespace-nowrap select-none md:text-[180px] lg:text-[220px]"
          >
            Followoo
          </div>
        </div>
      </section>
    </div>
  );
}
