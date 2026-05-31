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
  return (
    <Card
      color="foreground"
      className="flex flex-col w-150 h-auto"
      title="Followoo is available as an app!"
      description="Install Followoo on your device for a better experience and faster access."
    >
      <Button
        background="primary"
        foreground="foreground"
        onClick={() => {
          onInstall?.();
          console.log("Install clicked");
        }}
      >
        Install
      </Button>
      <Button
        background="accent"
        foreground="foreground"
        onClick={() => {
          onDismiss?.();
          console.log("Not now clicked");
        }}
      >
        Not now
      </Button>
    </Card>
  );
}
