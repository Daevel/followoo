import { useCallback, useLayoutEffect, useRef } from "react";
import { gsap } from "@/animations/gsap";
import { Button } from "./Button";
import { Card } from "./Card";

type PWANotificationProps = {
  onInstall?: () => void;
  onDismiss?: () => void;
};

export function PWANotification({
  onInstall,
  onDismiss,
}: PWANotificationProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const isClosingRef = useRef(false);

  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const isMobile = window.matchMedia("(max-width: 639px)").matches;
    const enterFromY = isMobile ? 24 : -16;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        rootRef.current,
        {
          opacity: 0,
          y: enterFromY,
          scale: 0.98,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.35,
          ease: "power3.out",
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const handleClose = useCallback((callback?: () => void) => {
    if (!rootRef.current || isClosingRef.current) return;

    isClosingRef.current = true;
    const isMobile = window.matchMedia("(max-width: 639px)").matches;
    const exitToY = isMobile ? 16 : -12;

    gsap.to(rootRef.current, {
      opacity: 0,
      y: exitToY,
      scale: 0.98,
      duration: 0.22,
      ease: "power2.in",
      onComplete: () => {
        callback?.();
      },
    });
  }, []);

  return (
    <div ref={rootRef} className="pointer-events-auto px-4 sm:px-0">
      <Card
        color="bg"
        opacity={true}
        className="flex flex-col justify-center w-full max-w-sm border border-primary bg-primary/50 shadow-lg"
        title="Followoo is available as an app!"
        description="Install Followoo on your device for a better experience and faster access."
      >
        <Button
          background="primary"
          foreground="foreground"
          onClick={() => {
            handleClose(onInstall);
          }}
        >
          Install
        </Button>
        <Button
          background="accent"
          foreground="foreground"
          onClick={() => {
            handleClose(onDismiss);
          }}
        >
          Not now
        </Button>
      </Card>
    </div>
  );
}
