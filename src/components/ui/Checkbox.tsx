import clsx from "clsx";
import { Icon } from "./Icon";

interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  hasError?: boolean;
}

export function Checkbox({
  label,
  className,
  hasError = false,
  disabled = false,
  checked = false,
  ...props
}: CheckboxProps) {
  return (
    <label
      className={clsx(
        "text-fg inline-flex items-center gap-2.5 text-sm",
        disabled ? "cursor-not-allowed opacity-45" : "cursor-pointer",
        className
      )}
    >
      <input
        type="checkbox"
        className="peer sr-only"
        disabled={disabled}
        aria-invalid={hasError}
        checked={checked}
        {...props}
      />

      <span
        aria-hidden="true"
        className={clsx(
          "flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-colors",
          "peer-focus-visible:shadow-ring",
          checked
            ? hasError
              ? "bg-danger-fill border-danger-fill text-on-brand"
              : "bg-brand border-brand text-on-brand"
            : hasError
              ? "bg-surface-1 border-danger/60"
              : "bg-surface-1 border-line-strong hover:border-fg-faint"
        )}
      >
        <Icon
          name="check"
          color="current"
          width={12}
          height={12}
          className={clsx(
            "transition-opacity",
            checked ? "opacity-100" : "opacity-0"
          )}
          aria-hidden="true"
        />
      </span>

      {label && <span className="text-start">{label}</span>}
    </label>
  );
}
