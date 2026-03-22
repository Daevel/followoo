import { Link } from "react-router-dom";

export function FooterSignature() {
  return (
    <footer className="w-full py-12">
      <div className="flex w-full items-start justify-center gap-[250px]">
        <div className="shrink-0">
          <img
            src="./favicon.svg"
            alt="favicon-footer"
            width={30}
            height={30}
          />
        </div>

        <div className="flex gap-24">
          <div className="flex flex-col gap-6">
            <h4 className="text-lg font-medium">Pages</h4>
            <div className="flex flex-col gap-4">
              <Link to="/">Home</Link>
              <Link to="/get-started">Get Started</Link>
              <Link to="/help">Support</Link>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="text-lg font-medium">Rules & Privacy</h4>
            <div className="flex flex-col gap-4">
              <Link to="/terms-of-service">Terms of service</Link>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="text-lg font-medium">Social</h4>
            <div className="flex flex-col gap-4">
              <Link to="/">Github</Link>
              <Link to="/get-started">LinkedIn</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
