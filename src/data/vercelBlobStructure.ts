type Steps = {
  step01: string;
  step02: string;
  step03: string;
  step04: string;
  step05: string;
  step06: string;
  step07: string;
  step08: string;
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
        "https://<tuo-blob-url>/videos/instruction-to-start/mobile/step-01.mp4",
      step02:
        "https://<tuo-blob-url>/videos/instruction-to-start/mobile/step-02.mp4",
      step03:
        "https://<tuo-blob-url>/videos/instruction-to-start/mobile/step-03.mp4",
      step04:
        "https://<tuo-blob-url>/videos/instruction-to-start/mobile/step-04.mp4",
      step05:
        "https://<tuo-blob-url>/videos/instruction-to-start/mobile/step-05.mp4",
      step06:
        "https://<tuo-blob-url>/videos/instruction-to-start/mobile/step-06.mp4",
      step07:
        "https://<tuo-blob-url>/videos/instruction-to-start/mobile/step-07.mp4",
      step08:
        "https://<tuo-blob-url>/videos/instruction-to-start/mobile/step-08.mp4",
    },
    desktop: {
      step01:
        "https://k2qsbqfidymsjjvn.public.blob.vercel-storage.com/videos/instructions-to-start/desktop/movie_prova.mp4",
      step02:
        "https://<tuo-blob-url>/videos/instruction-to-start/mobile/step-02.mp4",
      step03:
        "https://<tuo-blob-url>/videos/instruction-to-start/mobile/step-03.mp4",
      step04:
        "https://<tuo-blob-url>/videos/instruction-to-start/mobile/step-04.mp4",
      step05:
        "https://<tuo-blob-url>/videos/instruction-to-start/mobile/step-05.mp4",
      step06:
        "https://<tuo-blob-url>/videos/instruction-to-start/mobile/step-06.mp4",
      step07:
        "https://<tuo-blob-url>/videos/instruction-to-start/mobile/step-07.mp4",
      step08:
        "https://<tuo-blob-url>/videos/instruction-to-start/mobile/step-08.mp4",
    },
  },
};
