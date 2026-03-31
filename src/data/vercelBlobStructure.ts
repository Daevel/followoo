type Steps = {
  step01: string;
  step02: string;
  step03: string;
  step04?: string;
  step05?: string;
};

type Images = {
  heroLandingPage: string;
  male01: string;
  male02: string;
  female01: string;
  femaleGroup01: string;
};

type BlobStructure = {
  demoFile: string;
  images: Images;
  videos: { mobile: Steps; desktop: Steps };
};

export const vercelBlobStructure: BlobStructure = {
  demoFile:
    "https://k2qsbqfidymsjjvn.public.blob.vercel-storage.com/demoZipFile/demo-followoo-export-usage.zip",
  images: {
    heroLandingPage:
      "https://k2qsbqfidymsjjvn.public.blob.vercel-storage.com/images/double-phone-hero-landing-page.svg",
    male01:
      "https://k2qsbqfidymsjjvn.public.blob.vercel-storage.com/images/illustration-body-male-afro-phone.svg",
    male02:
      "https://k2qsbqfidymsjjvn.public.blob.vercel-storage.com/images/illustration-body-male-afro-2-phone.svg",
    female01:
      "https://k2qsbqfidymsjjvn.public.blob.vercel-storage.com/images/illustration-body-female-concerned-home.svg",
    femaleGroup01:
      "https://k2qsbqfidymsjjvn.public.blob.vercel-storage.com/images/illustration-composition-loading-phase.svg",
  },
  videos: {
    mobile: {
      step01:
        "https://k2qsbqfidymsjjvn.public.blob.vercel-storage.com/videos/instructions-to-start/mobile/mobile-step-01.mp4",
      step02:
        "https://k2qsbqfidymsjjvn.public.blob.vercel-storage.com/videos/instructions-to-start/mobile/mobile-step-02.mp4",
      step03:
        "https://k2qsbqfidymsjjvn.public.blob.vercel-storage.com/videos/instructions-to-start/mobile/mobile-step-03.mp4"
    },
    desktop: {
      step01:
        "https://k2qsbqfidymsjjvn.public.blob.vercel-storage.com/videos/instructions-to-start/desktop/desktop-step-01.mp4",
      step02:
        "https://k2qsbqfidymsjjvn.public.blob.vercel-storage.com/videos/instructions-to-start/desktop/desktop-step-02.mp4",
      step03:
        "https://k2qsbqfidymsjjvn.public.blob.vercel-storage.com/videos/instructions-to-start/desktop/desktop-step-03.mp4",
      step04:
        "https://k2qsbqfidymsjjvn.public.blob.vercel-storage.com/videos/instructions-to-start/desktop/desktop-step-04.mp4",
      step05:
        "https://k2qsbqfidymsjjvn.public.blob.vercel-storage.com/videos/instructions-to-start/desktop/desktop-step-05.mp4",
    },
  },
};
