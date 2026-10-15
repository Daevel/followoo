import { type RefObject, useEffect, useState } from "react";

// True while the element is on screen. Starts true so the server-rendered
// (prerendered) markup matches the first client render.
export function useIsInViewport(ref: RefObject<Element | null>) {
  const [isInViewport, setIsInViewport] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsInViewport(entry.isIntersecting);
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return isInViewport;
}
