import { Children, cloneElement, isValidElement, type ReactNode } from "react";
import { Icon } from "./Icon";

type FieldProps = {
  label: string;
  /** id of the control; links the label and the hint/error. */
  htmlFor: string;
  hint?: ReactNode;
  error?: string;
  /** Right-aligned meta under the control, e.g. a character counter. */
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
};

// Label + control + hint or error. The error replaces the hint, carries an
// icon (never color alone) and is wired to the control via aria-describedby.
export function Field({
  label,
  htmlFor,
  hint,
  error,
  meta,
  children,
  className,
}: FieldProps) {
  const messageId = `${htmlFor}-message`;
  const message = error ?? hint;
  const control = Children.only(children);

  return (
    <div className={`flex w-full flex-col gap-1.5 ${className ?? ""}`}>
      <label
        htmlFor={htmlFor}
        className="text-fg text-start text-[13px] font-medium"
      >
        {label}
      </label>

      {isValidElement<{
        "aria-describedby"?: string;
        "aria-invalid"?: boolean;
      }>(control)
        ? cloneElement(control, {
            "aria-describedby": message ? messageId : undefined,
            "aria-invalid": error ? true : undefined,
          })
        : control}

      {(message || meta) && (
        <div className="flex items-start justify-between gap-3 text-xs">
          {error ? (
            <p
              id={messageId}
              className="text-danger flex items-center gap-1.5 text-start"
            >
              <Icon
                name="warning"
                color="current"
                width={14}
                height={14}
                className="shrink-0"
                aria-hidden="true"
              />
              {error}
            </p>
          ) : hint ? (
            <p id={messageId} className="text-fg-muted text-start">
              {hint}
            </p>
          ) : (
            <span />
          )}
          {meta && (
            <span className="text-fg-faint shrink-0 tabular-nums">{meta}</span>
          )}
        </div>
      )}
    </div>
  );
}
