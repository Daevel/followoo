import { AppError } from "./AppError";
import { ERROR_CODES } from "./errorCodes";

export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError({
      code: ERROR_CODES.UNKNOWN_ERROR,
      message: error.message,
      userMessage: "Something went wrong. Please try again.",
      details: error,
    });
  }

  return new AppError({
    code: ERROR_CODES.UNKNOWN_ERROR,
    message: "Unknown error",
    userMessage: "Something went wrong. Please try again.",
    details: error,
  });
}