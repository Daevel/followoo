import { useEffect, useState } from "react";
import { toastService } from "../services/toastService";
import { ScreenMount } from "../ui/ScreenMount";
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

      <ScreenMount position="top-right" className="max-w-sm sm:w-full">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            toast={toast}
            duration={toast.duration}
            onClose={handleClose}
          />
        ))}
      </ScreenMount>
    </>
  );
}
