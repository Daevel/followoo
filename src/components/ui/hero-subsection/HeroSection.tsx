import { vercelBlobStructure } from "@/data/vercelBlobStructure";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { Icon, type IconName } from "../../../components/ui/Icon";

export function HeroSection() {
  const navigate = useNavigate();

  const coinTags = [
    {
      description: "100% local",
      iconName: "laptop" as IconName,
    },
    {
      description: "No API calls",
      iconName: "linkOff" as IconName,
    },
    {
      description: "Open Source (MIT)",
      iconName: "code" as IconName,
    },
  ];

  return (
    <section className="pt-16 md:pt-28">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 text-center">
        <div className="max-w-4xl">
          <h1 className="hero-h1 max-w-2xl text-3xl leading-[1.08] font-semibold sm:text-4xl sm:leading-tight md:text-6xl">
            <span className="sm:hidden">
              See who doesn&apos;t follow you back on{" "}
              <span className="from-accent/90 to-primary bg-linear-to-r bg-clip-text text-transparent">
                Instagram
              </span>
            </span>

            <span className="hidden sm:inline">
              Discover who doesn&apos;t follow you back on{" "}
              <span className="from-accent/90 to-primary bg-linear-to-r bg-clip-text text-transparent">
                Instagram
              </span>
            </span>
          </h1>

          <div className="text-accent mt-5 flex items-center justify-center gap-2 sm:mt-6 sm:gap-3">
            <Icon name="shield" color="accent" width={24} height={24} />
            <p className="text-lg font-semibold sm:text-xl">
              Your data never leaves your device
            </p>
          </div>

          <div className="mt-6 flex w-full max-w-sm flex-col justify-center gap-3 sm:mt-8 sm:max-w-none sm:flex-row sm:gap-2">
            <Button
              background="accent"
              foreground="foreground"
              onClick={() =>
                navigate("/get-started", { state: { isDemo: false } })
              }
            >
              Analyze your data
            </Button>

            <Button
              background="primary"
              foreground="foreground"
              onClick={() =>
                navigate("/get-started", { state: { isDemo: true } })
              }
            >
              Try demo
            </Button>
          </div>
        </div>

        <div className="mt-8 w-full max-w-3xl sm:mt-12">
          <img
            src={vercelBlobStructure.images.heroLandingPage}
            alt="Preview of Followoo results on mobile"
            className="mx-auto block h-auto w-[88%] max-w-85 sm:w-full sm:max-w-2xl md:max-w-3xl"
          />
        </div>

        <div className="mt-10 grid w-full max-w-5xl grid-cols-1 gap-6 md:mt-12 md:grid-cols-3 md:gap-8">
          {coinTags.map((item) => (
            <div
              key={item.description}
              className="flex flex-col items-center gap-4 text-center"
            >
              <div className="bg-accent flex h-15 w-15 items-center justify-center rounded-full">
                <Icon
                  name={item.iconName}
                  color="foreground"
                  width={30}
                  height={30}
                />
              </div>

              <h3>{item.description}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
