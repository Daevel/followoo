import { useNavigate } from "react-router";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export function UnknownErrorPage() {
  const navigate = useNavigate();

  return (
    <div
      id="error-container"
      className="border-line-subtle bg-surface-1 shadow-elev-1 flex w-full flex-col items-center rounded-card border px-5 py-10 text-center md:px-8"
    >
      <span className="border-line-strong bg-surface-2 text-warning flex size-10 items-center justify-center rounded-control border">
        <Icon
          name="warning"
          color="current"
          width={20}
          height={20}
          aria-hidden="true"
        />
      </span>
      <h2 className="text-fg mt-4 text-lg font-semibold tracking-[-0.015em]">
        We couldn&apos;t load the latest updates
      </h2>
      <p className="text-fg-muted mt-2 max-w-sm text-sm leading-[1.55]">
        Something went wrong while fetching the content. Please try again in a
        moment.
      </p>
      <Button className="mt-6" onClick={() => navigate("/")}>
        Back to homepage
      </Button>
    </div>
  );
}
