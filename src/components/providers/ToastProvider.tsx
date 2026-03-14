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

  useEffect(() => {
    if (toasts.length === 0) return;

    const timers = toasts.map((toast) =>
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== toast.id));
      }, toast.duration),
    );

    return () => timers.forEach(window.clearTimeout);
  }, [toasts]);

  function handleClose(id: string) {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }

  return (
    <>
      {children}

      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={handleClose} />
        ))}
      </div>
    </>
  );
}