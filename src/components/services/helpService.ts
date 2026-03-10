import emailjs from '@emailjs/browser';
import type { HelpFormValues } from '../schemas/help.schema';

export async function sendHelpMessage(data: HelpFormValues) {
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