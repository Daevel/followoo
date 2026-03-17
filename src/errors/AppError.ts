import type { AppErrorCode } from "./errorCodes";

type AppErrorParams = {
  code: AppErrorCode;
  message: string;
  userMessage: string;
  details?: unknown;
};

export class AppError extends Error {
  public readonly code: AppErrorCode;
  public readonly userMessage: string;
  public readonly details?: unknown;

  constructor({ code, message, userMessage, details }: AppErrorParams) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.userMessage = userMessage;
    this.details = details;

    Object.setPrototypeOf(this, AppError.prototype);
  }
}