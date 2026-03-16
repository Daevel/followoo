import { Link } from "react-router-dom";

export function FooterSignature() {
  return (
    <footer className="mt-auto flex flex-col items-center justify-center gap-2 py-6 text-primary">
      <p className="p3-b">
        followoo.app - made by{" "}
        <Link to="https://github.com/Daevel" target="_blank">
          <b>daevel</b>
        </Link>
      </p>
      <div className="p3-r flex flex-row underline gap-5">
        <Link
          className=" hover:text-accent transition-colors"
          to="https://github.com/Daevel"
          target="_blank"
        >
          <p>Github</p>
        </Link>
        <Link
          className=" hover:text-accent transition-colors"
          to="/updates"
        >
          <p>Updates</p>
        </Link>
      </div>
      <p className="p3-r">All rights reserved</p>
    </footer>
  );
}
