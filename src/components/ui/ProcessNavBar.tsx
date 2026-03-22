import { useNavigate } from "react-router";
import { Icon } from "./Icon";

interface ProcessNavBarProps {
  title?: string;
  showBack?: boolean;
  showHelp?: boolean;
}

export function ProcessNavBar({
  title,
  showBack = true,
  showHelp = true,
}: ProcessNavBarProps) {
  
  const navigate = useNavigate();

  return (
    <header className="w-full">
      <div className="mx-auto py-4 w-full max-w-7xl">
        <div className="grid min-h-14 grid-cols-[44px_1fr_44px] items-center">
          <div className="flex justify-start">
            {showBack ? (
              <button
                type="button"
                onClick={() => navigate(-1)}
                aria-label="Go back"
                className="inline-flex items-center justify-center rounded-md text-foreground transition hover:bg-white/10"
              >
                <Icon name="arrowLeft" className="max-sm:h-8 max-sm:w-8 h-6 w-6" />
              </button>
            ) : (
              <div className="h-11 w-11" />
            )}
          </div>

          <div className="px-2 text-center">
            {title ? (
              <h2 className="truncate text-sm font-medium text-foreground sm:text-foreground">
                {title}
              </h2>
            ) : null}
          </div>

          <div className="flex justify-end">
            {showHelp ? (
              <button
                type="button"
                onClick={() => navigate("/help")}
                aria-label="Open help"
                className="inline-flex items-center justify-center rounded-md text-foreground transition hover:bg-white/10"
              >
                <Icon name="help" className="max-sm:h-8 max-sm:w-8 h-6 w-6" />
              </button>
            ) : (
              <div className="h-11 w-11" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
