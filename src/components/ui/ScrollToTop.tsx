import { useEffect } from "react";
import { useLocation } from "react-router";

// Mounted once outside <Routes>, so it must re-run on every pathname change.
export function ScrollToTop() {
  const { pathname } = useLocation();

  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname is the trigger, not a value read inside the effect.
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth" as ScrollBehavior,
    });
  }, [pathname]);

  return null;
}
