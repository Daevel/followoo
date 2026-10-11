import { z } from "zod";

// Deliberately not compared against (or validated by) the Clerk account
// password in any way - see this feature's wizard copy and project
// context: Followoo never has access to that password to begin with.
export const syncActivationPassphraseSchema = z
  .object({
    passphrase: z.string().min(12, {
      error: "Your passphrase must be at least 12 characters.",
    }),
    confirmPassphrase: z.string(),
  })
  .refine((data) => data.passphrase === data.confirmPassphrase, {
    error: "The two passphrases do not match.",
    path: ["confirmPassphrase"],
  });

export type SyncActivationPassphraseValues = z.infer<
  typeof syncActivationPassphraseSchema
>;
