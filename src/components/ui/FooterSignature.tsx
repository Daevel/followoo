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
      <p className="p3-r">All rights reserved</p>
    </footer>
  );
}
