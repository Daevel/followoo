import clsx from "clsx";

interface InputProps {
  placeholder?: string;
  variant?: "input" | "textarea";
  maxLength?: number;
  type?: "text" | "email" | "number" | "file";
  name?: string;
  value?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

export function Input({
  placeholder,
  variant = "input",
  type = "text",
  name,
  value = "",
  onChange,
  maxLength = 500,
}: InputProps) {
  const baseClasses =
    "w-full text-black bg-gray-200 border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent";

  if (variant === "textarea") {
    return (
      <div className="w-full flex flex-col gap-1">
        <textarea
          name={name}
          value={value}
          maxLength={maxLength}
          onChange={onChange}
          placeholder={placeholder}
          className={clsx(baseClasses, "min-h-[140px] resize-none py-3")}
        />
        <span className="self-end text-xs text-base/70">
          {value.length}/{maxLength}
        </span>
      </div>
    );
  }

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={baseClasses}
      name={name}
    />
  );
}