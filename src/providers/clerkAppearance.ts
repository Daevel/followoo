import type { ClerkProvider } from "@clerk/react";
import type { ComponentProps } from "react";

type Appearance = NonNullable<
  ComponentProps<typeof ClerkProvider>["appearance"]
>;

const link = { color: "var(--color-brand-fg)" };

/**
 * Colors, fonts and radius come from the --clerk-* variables in
 * src/index.css, which point at Followoo's theme tokens. Here only what
 * has no variable: text links use brand-fg like the rest of the site
 * (Clerk would paint them with the primary fill, too dark on dark).
 */
export const clerkAppearance: Appearance = {
  elements: {
    footerActionLink: link,
    formFieldAction: link,
    formResendCodeLink: link,
    identityPreviewEditButton: link,
  },
};
