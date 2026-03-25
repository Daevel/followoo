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
    <section className="pt-24 md:pt-28">
      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
        <div className="max-w-4xl">
          <h1 className="hero-h1 font-semibold">
            Discover who doesn't follow you back on{" "}
            <span className="from-accent/90 to-primary bg-linear-to-r bg-clip-text text-transparent">
              Instagram
            </span>
          </h1>

          <div className="text-accent mt-6 flex items-center justify-center gap-3">
            <Icon name="shield" color="accent" width={32} height={32} />
            <h3 className="hero-h3">Your data never leaves your device</h3>
          </div>

          <div className="mt-8 flex flex-row justify-center gap-2 max-sm:flex-col max-sm:gap-y-2">
            <Button
              background="accent"
              foreground="foreground"
              onClick={() => navigate("/get-started")}
            >
              Analyze your data
            </Button>
            <Button
              background="primary"
              foreground="foreground"
              onClick={() => navigate("/get-started")}
            >
              Try demo
            </Button>
          </div>
        </div>

        <div className="mt-12 w-full max-w-3xl">
          <img
            src="images/double-phone-hero-landing-page.svg"
            alt="Preview of Followoo results on mobile"
            className="mx-auto block h-auto w-full max-w-2xl sm:max-w-3xl"
          />
        </div>

        <div className="mt-12 grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
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
