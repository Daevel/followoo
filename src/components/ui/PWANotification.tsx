import { useRef } from "react";
import { useDismissibleNotificationAnimation } from "@/animations/hooks/useDismissibleNotificationAnimation";
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
  const { closeWithAnimation } = useDismissibleNotificationAnimation(rootRef);

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
            closeWithAnimation(onInstall);
          }}
        >
          Install
        </Button>
        <Button
          background="accent"
          foreground="foreground"
          onClick={() => {
            closeWithAnimation(onDismiss);
          }}
        >
          Not now
        </Button>
      </Card>
    </div>
  );
}
