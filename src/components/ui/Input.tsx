import clsx from "clsx";
import { forwardRef } from "react";

type BaseProps = {
  placeholder?: string;
  variant?: "input" | "textarea";
  maxLength?: number;
  hasError?: boolean;
};

type InputVariantProps = BaseProps &
  React.InputHTMLAttributes<HTMLInputElement> & {
    variant?: "input";
  };

type TextareaVariantProps = BaseProps &
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    variant: "textarea";
  };

type InputProps = InputVariantProps | TextareaVariantProps;

export const Input = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputProps
>(function Input(props, ref) {
  const {
    placeholder,
    variant = "input",
    maxLength = 500,
    className,
    hasError = false,
    ...rest
  } = props;

  const baseClasses =
    "w-full bg-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:border-transparent text-[#000000]";

  const stateClasses = hasError
    ? "border border-accent focus:ring-accent"
    : "border border-gray-300 focus:ring-primary";

  if (variant === "textarea") {
    const textareaProps =
      rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>;

    return (
      <div className="w-full flex flex-col gap-1 text-[#000000]">
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          maxLength={maxLength}
          placeholder={placeholder}
          aria-invalid={hasError}
          className={clsx(
            baseClasses,
            stateClasses,
            "min-h-[140px] resize-none py-3",
            className,
          )}
          {...textareaProps}
        />
      </div>
    );
  }

  const inputProps = rest as React.InputHTMLAttributes<HTMLInputElement>;

  return (
    <input
      ref={ref as React.Ref<HTMLInputElement>}
      placeholder={placeholder}
      aria-invalid={hasError}
      className={clsx(baseClasses, stateClasses, className)}
      {...inputProps}
    />
  );
});