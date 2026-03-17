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