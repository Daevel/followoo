import { registerSW } from "virtual:pwa-register";
import { useEffect } from "react";
import { toastService } from "@/services/toastService";

export function usePwaUpdateToast() {
  useEffect(() => {
    const updateServiceWorker = registerSW({
      onNeedRefresh() {
        toastService.info({
          title: "New version available",
          description: "Update Followoo now to use the latest improvements.",
          duration: Number.POSITIVE_INFINITY,
          action: {
            label: "Update now",
            onClick: () => updateServiceWorker(true),
          },
        });
      },
      onOfflineReady() {
        toastService.success({
          title: "Followoo is ready offline",
          description: "The app can now open faster on this device.",
        });
      },
    });
  }, []);
}
