import { animationTokens } from "./tokens";

export const animationPresets = {
  revealUp: {
    from: {
      autoAlpha: 0,
      y: animationTokens.distance.lg,
    },
    to: {
      autoAlpha: 1,
      y: 0,
      duration: animationTokens.duration.slow,
      ease: animationTokens.ease.entrance,
    },
  },

  revealDown: {
    from: {
      autoAlpha: 0,
      y: -animationTokens.distance.lg,
    },
    to: {
      autoAlpha: 1,
      y: 0,
      duration: animationTokens.duration.slow,
      ease: animationTokens.ease.entrance,
    },
  },

  fadeIn: {
    from: {
      autoAlpha: 0,
    },
    to: {
      autoAlpha: 1,
      duration: animationTokens.duration.base,
      ease: animationTokens.ease.standard,
    },
  },

  hoverLift: {
    cardEnter: {
      y: -animationTokens.distance.sm,
      scale: animationTokens.scale.hover,
      duration: 0.28,
      ease: animationTokens.ease.standard,
    },
    cardLeave: {
      y: 0,
      scale: 1,
      duration: animationTokens.duration.base,
      ease: animationTokens.ease.standard,
    },
    iconEnter: {
      scale: animationTokens.scale.iconHover,
      duration: 0.28,
      ease: animationTokens.ease.standard,
    },
    iconLeave: {
      scale: 1,
      duration: animationTokens.duration.base,
      ease: animationTokens.ease.standard,
    },
  },
} as const;
