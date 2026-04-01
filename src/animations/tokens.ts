export const animationTokens = {
  duration: {
    instant: 0.16,
    fast: 0.24,
    base: 0.32,
    slow: 0.48,
    slower: 0.64,
  },
  ease: {
    standard: "power2.out",
    entrance: "power3.out",
    exit: "power2.in",
    emphasized: "expo.out",
  },
  distance: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 40,
  },
  scale: {
    hover: 1.015,
    press: 0.985,
    iconHover: 1.06,
  },
  stagger: {
    tight: 0.04,
    base: 0.08,
    relaxed: 0.12,
  },
} as const;
