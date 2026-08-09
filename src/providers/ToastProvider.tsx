import { lazy, Suspense, useEffect, useState } from "react";
import { ScreenMount } from "@/components/ui/ScreenMount";
import type { ToastItem } from "@/components/ui/Toast";
import { usePwaInstallPrompt } from "@/features/pwa-install/hooks/usePwaInstallPrompt";
import { usePwaUpdateToast } from "@/pwa/usePwaUpdateToast";
import { toastService } from "@/services/toastService";

const Toast = lazy(() =>
  import("@/components/ui/Toast").then((module) => ({
    default: module.Toast,
  }))
);

type InternalToast = ToastItem & {
  duration: number;
};

type ToastProviderProps = {
  children: React.ReactNode;
};

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<InternalToast[]>([]);

  usePwaInstallPrompt();
  usePwaUpdateToast();

  useEffect(() => {
    return toastService.subscribe((toast) => {
      const nextToast: InternalToast = {
        ...toast,
        duration: toast.duration ?? 4000,
      };

      setToasts((prev) => [...prev, nextToast]);
    });
  }, []);

  function handleClose(id: string) {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }

  return (
    <>
      {children}

      <ScreenMount position="top-right" className="max-w-sm sm:w-full">
        <Suspense fallback={null}>
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              toast={toast}
              duration={toast.duration}
              onClose={handleClose}
            />
          ))}
        </Suspense>
      </ScreenMount>
    </>
  );
}
