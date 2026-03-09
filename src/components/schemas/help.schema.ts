import { z } from 'zod';

export const helpSchema = z.object({
    fullName: z.string().trim().min(2, { error: "Full name must be at least 2 characters." }),
    email: z.email({ error: "Please enter a valid email address. "}).trim(),
    message: z.string().trim().min(10, { error: "Message must be at least 10 characters." }).max(2000, { error: "Message is too long." }),
});

export type HelpFormValues = z.infer<typeof helpSchema>;