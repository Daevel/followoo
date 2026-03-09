import clsx from "clsx";
import { Icon } from "./Icon";

interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
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
        "inline-flex items-center gap-3",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        className,
      )}
    >
      <input
        type="checkbox"
        className="sr-only peer"
        disabled={disabled}
        aria-invalid={hasError}
        checked={checked}
        {...props}
      />

      {label && <span className="text-foreground">{label}</span>}

      <span
        className={clsx(
          "flex h-5 w-5 items-center justify-center border transition-colors",
          checked ? "bg-primary border-primary" : "bg-bg border-foreground/40",
          hasError && checked && "bg-accent border-accent",
          hasError && !checked && "border-accent",
          "peer-focus:ring-2 peer-focus:ring-primary",
          hasError && "peer-focus:ring-accent",
        )}
      >
        <Icon
          name="check"
          color="foreground"
          width={14}
          height={14}
          className={clsx(
            "transition-opacity",
            checked ? "opacity-100" : "opacity-0",
          )}
          aria-hidden="true"
        />
      </span>
    </label>
  );
}
