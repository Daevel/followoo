import { ANALYTICS_EVENTS } from "@/analytics/analyticsEvents";
import { analyticsService } from "@/analytics/analyticsService";
import { toastService } from "../components/services/toastService";
import { AppError } from "./AppError";
import { toAppError } from "./toAppError";

type HandleAppErrorOptions = {
  showToast?: boolean;
  log?: boolean;
  fallbackTitle?: string;
};

export function handleAppError(
  error: unknown,
  options: HandleAppErrorOptions = {},
): AppError {
  const {
    showToast = true,
    log = true,
    fallbackTitle = "Something went wrong",
  } = options;

  const appError = toAppError(error);

  analyticsService.track(ANALYTICS_EVENTS.APP_ERROR, {
    code: appError.code,
    context: "global_handler",
  });

  if (log) {
    console.error("[AppError]", {
      code: appError.code,
      message: appError.message,
      userMessage: appError.userMessage,
      details: appError.details,
    });
  }

  if (showToast) {
    toastService.warning({
      title: fallbackTitle,
      description: appError.userMessage,
    });
  }

  return appError;
}
