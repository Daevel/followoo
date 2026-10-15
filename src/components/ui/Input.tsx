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
    "bg-surface-1 text-fg placeholder:text-fg-faint w-full rounded-control border px-3 text-sm transition-colors focus:outline-none";

  // Border colors are exclusive per state: a shared base color would win the cascade.
  const stateClasses = hasError
    ? "border-danger/60 focus:border-danger focus:shadow-[0_0_0_3px_rgb(251_113_133/0.18)]"
    : "border-line-strong hover:border-fg-faint focus:border-brand-fg focus:shadow-[0_0_0_3px_rgb(165_180_252/0.18)]";

  if (variant === "textarea") {
    const textareaProps =
      rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>;

    return (
      <div className="flex w-full flex-col gap-1">
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          maxLength={maxLength}
          placeholder={placeholder}
          aria-invalid={hasError}
          className={clsx(
            baseClasses,
            stateClasses,
            "min-h-[140px] resize-none py-2.5 leading-[1.55]",
            className
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
      className={clsx(baseClasses, stateClasses, "h-10", className)}
      {...inputProps}
    />
  );
});
