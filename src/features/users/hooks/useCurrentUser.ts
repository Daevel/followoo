import { useAuth } from "@clerk/react";
import { useEffect, useState } from "react";
import { AppError, ERROR_CODES, handleAppError } from "@/errors";
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
        let token: string | null;

        try {
          token = await getToken();
        } catch (error) {
          throw new AppError({
            code: ERROR_CODES.AUTH_SESSION_UNAVAILABLE,
            message: "Clerk failed to provide a session token",
            userMessage:
              "We couldn't verify your session. Please sign in again.",
            details: error,
          });
        }

        if (!token) {
          throw new AppError({
            code: ERROR_CODES.AUTH_SESSION_UNAVAILABLE,
            message: "Clerk returned no session token",
            userMessage:
              "We couldn't verify your session. Please sign in again.",
          });
        }

        let user: CurrentUser;

        try {
          user = await fetchCurrentUser(token);
        } catch (error) {
          throw new AppError({
            code: ERROR_CODES.ACCOUNT_FETCH_FAILED,
            message: "Failed to load the current account",
            userMessage:
              "We couldn't load your account right now. Please try again shortly.",
            details: error,
          });
        }

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
