import { ClerkProvider } from "@clerk/react";
import type { Preview } from "@storybook/react-vite";
import type { ComponentProps } from "react";
import { MemoryRouter } from "react-router";
import "../src/index.css";

// Clerk-aware components (NavBar's <Show>/<SignInButton>/<UserButton>,
// useAuth) throw without a <ClerkProvider> ancestor, so every story gets
// one. With VITE_CLERK_PUBLISHABLE_KEY in the local .env, Clerk really
// loads (dev instance, no session). Without it - Chromatic in CI - Clerk
// gets an offline stub whose load() never settles: no script download, no
// network errors, deterministic snapshots. Clerk stays in its "loading"
// state, so signed-in/signed-out-only UI (e.g. "Sign in") doesn't render.
const envClerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const offlineClerkProps: Partial<ComponentProps<typeof ClerkProvider>> =
  envClerkKey
    ? {}
    : {
        Clerk: {
          loaded: false,
          load: () => new Promise<never>(() => {}),
        } as unknown as ComponentProps<typeof ClerkProvider>["Clerk"],
      };
// Well-formed but unused placeholder: the stub above never contacts it.
const clerkPublishableKey =
  envClerkKey || `pk_test_${btoa("clerk.storybook.invalid$")}`;

const preview: Preview = {
  decorators: [
    (Story) => (
      <ClerkProvider
        publishableKey={clerkPublishableKey}
        {...offlineClerkProps}
      >
        <MemoryRouter>
          <div className="min-h-screen bg-surface-0 text-fg p-6">
            <Story />
          </div>
        </MemoryRouter>
      </ClerkProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
};

export default preview;
