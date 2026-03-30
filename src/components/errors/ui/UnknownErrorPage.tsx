import { vercelBlobStructure } from "@/data/vercelBlobStructure";
import { useNavigate } from "react-router-dom";
import { Button } from "../../ui/Button";

export function UnknownErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="text-foreground bg-primary/10 flex w-full flex-col items-center justify-center rounded-[10px] border py-8 text-center">
      <div
        id="error-container"
        className="text-accent flex flex-col items-center justify-center text-center align-middle"
      >
        <h2>Unable to load content right now.</h2>
        <img
          src={vercelBlobStructure.images.female01}
          alt="woman concerned image"
        />
        <div className="text-accent flex flex-col items-center gap-5">
          <p>A generic error occurred. Please try again later.</p>
          <Button onClick={() => navigate("/")}>Back to homepage</Button>
        </div>
      </div>
    </div>
  );
}
