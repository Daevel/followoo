import type { RefObject } from "react";
import { gsap, useGSAP } from "../gsap";

const sectionConfigs = [
  {
    section: "[data-section='features']",
    heading: "[data-section='features'] [data-animate='section-heading']",
    subheading: "[data-section='features'] [data-animate='section-subheading']",
    items: "[data-section='features'] [data-animate='feature-card']",
    icon: null,
  },
  {
    section: "[data-section='privacy']",
    heading: "[data-section='privacy'] [data-animate='section-heading']",
    subheading: "[data-section='privacy'] [data-animate='section-subheading']",
    items: "[data-section='privacy'] [data-animate='privacy-card']",
    icon: "[data-section='privacy'] [data-animate='section-icon']",
  },
  {
    section: "[data-section='faq']",
    heading: "[data-section='faq'] [data-animate='section-heading']",
    subheading: null,
    items: "[data-section='faq'] [data-animate='faq-card']",
    icon: "[data-section='faq'] [data-animate='section-icon']",
  },
];

sectionConfigs.forEach(({ section, heading, subheading, items, icon }) => {
  if (icon) {
    gsap.set(icon, {
      autoAlpha: 0,
      y: 18,
      scale: 0.96,
    });
  }

  gsap.set(heading, {
    autoAlpha: 0,
    y: 20,
  });

  if (subheading) {
    gsap.set(subheading, {
      autoAlpha: 0,
      y: 16,
    });
  }

  gsap.set(items, {
    autoAlpha: 0,
    y: 24,
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 72%",
      once: true,
    },
  });

  if (icon) {
    tl.to(icon, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: "power3.out",
    });
  }

  tl.to(
    heading,
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.7,
      ease: "power3.out",
    },
    icon ? "-=0.2" : 0,
  );

  if (subheading) {
    tl.to(
      subheading,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      },
      "-=0.35",
    );
  }

  tl.to(
    items,
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.65,
      ease: "power3.out",
      stagger: 0.08,
    },
    "-=0.2",
  );
});

export function useLandingPageAnimations(
  rootRef: RefObject<HTMLDivElement | null>,
) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // HERO - initial load
      gsap.fromTo(
        "[data-animate='hero-title']",
        {
          autoAlpha: 0,
          y: 24,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        },
      );

      gsap.fromTo(
        "[data-animate='hero-trust'], [data-animate='hero-actions']",
        {
          autoAlpha: 0,
          y: 20,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.1,
          delay: 0.1,
        },
      );

      gsap.fromTo(
        "[data-animate='hero-visual']",
        {
          autoAlpha: 0,
          y: 32,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          delay: 0.2,
        },
      );

      gsap.fromTo(
        "[data-animate='hero-coin']",
        {
          autoAlpha: 0,
          y: 20,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.65,
          ease: "power3.out",
          stagger: 0.08,
          delay: 0.35,
        },
      );

      const sectionConfigs = [
        {
          section: "[data-section='features']",
          heading: "[data-section='features'] [data-animate='section-heading']",
          subheading:
            "[data-section='features'] [data-animate='section-subheading']",
          items: "[data-section='features'] [data-animate='feature-card']",
          icon: null,
        },
        {
          section: "[data-section='privacy']",
          heading: "[data-section='privacy'] [data-animate='section-heading']",
          subheading:
            "[data-section='privacy'] [data-animate='section-subheading']",
          items: "[data-section='privacy'] [data-animate='privacy-card']",
          icon: "[data-section='privacy'] [data-animate='section-icon']",
        },
        {
          section: "[data-section='faq']",
          heading: "[data-section='faq'] [data-animate='section-heading']",
          subheading: null,
          items: "[data-section='faq'] [data-animate='faq-card']",
          icon: "[data-section='faq'] [data-animate='section-icon']",
        },
      ];

      sectionConfigs.forEach(
        ({ section, heading, subheading, items, icon }) => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top 72%",
              once: true,
            },
          });

          if (icon) {
            tl.fromTo(
              icon,
              {
                autoAlpha: 0,
                y: 18,
                scale: 0.96,
              },
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                ease: "power3.out",
              },
            );
          }

          tl.fromTo(
            heading,
            {
              autoAlpha: 0,
              y: 20,
            },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
            },
            icon ? "-=0.2" : undefined,
          );

          if (subheading) {
            tl.fromTo(
              subheading,
              {
                autoAlpha: 0,
                y: 16,
              },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out",
              },
              "-=0.35",
            );
          }

          tl.fromTo(
            items,
            {
              autoAlpha: 0,
              y: 24,
            },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.65,
              ease: "power3.out",
              stagger: 0.08,
            },
            "-=0.2",
          );
        },
      );

      // Footer
      gsap.fromTo(
        "[data-animate='footer-signature']",
        {
          autoAlpha: 0,
          y: 24,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-section='footer-signature']",
            start: "top 85%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        "[data-animate='footer-brand']",
        {
          autoAlpha: 0,
          y: 40,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-section='footer-signature']",
            start: "top 85%",
            once: true,
          },
        },
      );

      // Optional desktop-only parallax
      mm.add("(min-width: 768px)", () => {
        gsap.to("[data-animate='hero-visual']", {
          yPercent: -4,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-section='hero']",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      return () => {
        mm.revert();
      };
    },
    { scope: rootRef },
  );
}
