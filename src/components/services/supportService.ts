import emailjs from "@emailjs/browser";
import type { SupportFormValues } from "../schemas/support.schema";

export async function sendSupportMessage(data: SupportFormValues) {
  return emailjs.send(
    import.meta.env.VITE_EMAILJS_SERVICE_ID,
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    {
      name: data.fullName,
      email: data.email,
      message: data.message,
    },
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  );
}
