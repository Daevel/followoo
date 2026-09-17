import { useAuth } from "@clerk/react";
import { useEffect, useState } from "react";
import { handleAppError } from "@/errors";
import { type CurrentUser, fetchCurrentUser } from "../services/usersService";

type UseCurrentUserResult = {
  userId: string | null;
  email: string | null;
  plan: CurrentUser["plan"] | null;
  isLoading: boolean;
};

/**
 * GET /users/me for the signed-in user. Skips the call entirely when
 * signed out - there is nothing to fetch and no reason to hit the
 * backend. Today `plan` always resolves to "base" for everyone
 * (subscriptions is empty until v3.0.0 Task 3 wires up Stripe); this hook
 * is what v3.1.0's first Pro-only feature will read to tell base and pro
 * apart.
 */
export function useCurrentUser(): UseCurrentUserResult {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadCurrentUser() {
      if (!isLoaded) return;

      if (!isSignedIn) {
        setCurrentUser(null);
        return;
      }

      setIsLoading(true);

      try {
        const token = await getToken();

        if (!token) return;

        const user = await fetchCurrentUser(token);

        if (isMounted) {
          setCurrentUser(user);
        }
      } catch (error) {
        handleAppError(error, {
          showToast: false,
          fallbackTitle: "Unable to load your account",
        });
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadCurrentUser();

    return () => {
      isMounted = false;
    };
  }, [isLoaded, isSignedIn, getToken]);

  return {
    userId: currentUser?.userId ?? null,
    email: currentUser?.email ?? null,
    plan: currentUser?.plan ?? null,
    isLoading,
  };
}
