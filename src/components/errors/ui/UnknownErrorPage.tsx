import { vercelBlobStructure } from "@/data/vercelBlobStructure";
import { useNavigate } from "react-router-dom";
import { Button } from "../../ui/Button";

export function UnknownErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="border-foreground/10 bg-foreground/5 w-full rounded-[10px] border p-5 md:p-6">
      <div
        id="error-container"
        className="text-foreground flex flex-col items-center justify-center px-4 text-center align-middle"
      >
        <h2>We couldn't load the latest updates</h2>
        <img
          src={vercelBlobStructure.images.female01}
          alt="woman concerned image"
        />
        <div className="text-foreground flex flex-col items-center gap-8 px-4">
          <p>
            Something went wrong while fetching the content. Please try again in
            a moment.
          </p>
          <div className="flex flex-row gap-3 max-sm:flex-col">
            <Button background="primary" onClick={() => navigate("/")}>
              Back to homepage
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
