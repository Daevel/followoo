import { Link } from "react-router-dom";

export function FooterSignature() {
  return (
    <footer className="flex flex-col mt-20 items-center justify-center gap-2 text-primary">
      <p className="p3-b">
        followoo.track - made by{" "}
        <Link to="https://github.com/Daevel" target="blank">
          <b>daevel</b>
        </Link>
      </p>
      <p className="p3-r">All rights reserved</p>
    </footer>
  );
}
