import { useNavigate } from "react-router";
import { Icon } from "./Icon";

interface NavBarProps {
  title?: string;
  showBack?: boolean;
  showHelp?: boolean;
}

export function NavBar({
  title,
  showBack = true,
  showHelp = true,
}: NavBarProps) {
  
  const navigate = useNavigate();

  return (
    <header className="w-full">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-5 lg:px-8">
        <div className="grid min-h-14 grid-cols-[44px_1fr_44px] items-center">
          <div className="flex justify-start">
            {showBack ? (
              <button
                type="button"
                onClick={() => navigate(-1)}
                aria-label="Go back"
                className="inline-flex items-center justify-center rounded-md text-base transition hover:bg-white/10"
              >
                <Icon name="chevronDoubleLeft" className="sm:h-8 sm:w-8 lg:h-11 lg:w-11" />
              </button>
            ) : (
              <div className="h-11 w-11" />
            )}
          </div>

          <div className="px-2 text-center">
            {title ? (
              <h2 className="truncate text-sm font-medium text-base sm:text-base">
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
                className="inline-flex items-center justify-center rounded-md text-base transition hover:bg-white/10"
              >
                <Icon name="help" className="sm:h-8 sm:w-8 lg:h-11 lg:w-11" />
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
