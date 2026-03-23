import {Link} from "react-router";

export function NavBar() {
  return (
    <div className="flex flex-row text-foreground align-middle justify-between px-18">
      <nav className="w-full flex flex-row h-25 align-middle items-center text-center justify-between">
        <div className="flex flex-row gap-4 align-middle items-center">
          <img src="./favicon.svg" alt="app icon" width={32} height={32} />
          <h3>Followoo</h3>
        </div>
        <div className="flex flex-row gap-12 align-middle items-center">
          <Link
            to="/instructions-to-start"
            className=" text-foreground transition-colors hover:text-primary font-semibold"
          >
            How to start
          </Link>
          <Link
            to="/get-started"
            className=" text-foreground transition-colors hover:text-primary font-semibold"
          >
            Analyze your export
          </Link>
          <Link
            to="/terms-and-conditions"
            className=" text-foreground transition-colors hover:text-primary font-semibold"
          >
            Terms and conditions
          </Link>
        </div>
        <div className="flex flex-row">
          <Link
            to="/updates"
            className=" text-foreground transition-colors hover:text-primary font-semibold"
          >
            Updates
          </Link>
        </div>
      </nav>
    </div>
  );
}
