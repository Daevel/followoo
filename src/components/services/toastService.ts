type ToastVariant = "info" | "success" | "warning";

export type ToastPayload = {
  title: string;
  description?: string;
  variant: ToastVariant;
  duration?: number;
};

type ToastListener = (toast: ToastPayload & { id: string }) => void;

const listeners = new Set<ToastListener>();

function emit(toast: ToastPayload) {
  const item = {
    id: crypto.randomUUID(),
    duration: 4000,
    ...toast,
  };

  listeners.forEach((listener) => listener(item));
}

export const toastService = {
  subscribe(listener: ToastListener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  info(payload: Omit<ToastPayload, "variant">) {
    emit({ ...payload, variant: "info" });
  },

  success(payload: Omit<ToastPayload, "variant">) {
    emit({ ...payload, variant: "success" });
  },

  warning(payload: Omit<ToastPayload, "variant">) {
    emit({ ...payload, variant: "warning" });
  },
};