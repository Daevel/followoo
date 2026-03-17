import { useEffect, useState } from "react";
import { toastService } from "../services/toastService";
import { Toast, type ToastItem } from "../ui/Toast";

type InternalToast = ToastItem & {
  duration: number;
};

type ToastProviderProps = {
  children: React.ReactNode;
};

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<InternalToast[]>([]);

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

      <div
        className="
          pointer-events-none fixed z-50 flex flex-col gap-3
          top-4 right-4 w-[calc(100vw-2rem)] max-w-sm
          sm:top-4 sm:right-4 sm:w-full sm:max-w-sm
          max-sm:left-1/2 max-sm:right-auto max-sm:top-auto
          max-sm:bottom-[calc(1rem+env(safe-area-inset-bottom))]
          max-sm:-translate-x-1/2
        "
      >
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            toast={toast}
            duration={toast.duration}
            onClose={handleClose}
          />
        ))}
      </div>
    </>
  );
}