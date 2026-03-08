import { useState } from "react";
import clsx from "clsx";

interface InputProps {
  placeholder?: string;
  variant?: "input" | "textarea";
  maxLength?: number;
}

export function Input({
  placeholder,
  variant = "input",
  maxLength = 500,
}: InputProps) {
  const [value, setValue] = useState("");

  const baseClasses =
    "w-full text-black bg-gray-200 border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent";

  if (variant === "textarea") {
    return (
      <div className="w-full flex flex-col gap-1">
        <textarea
          value={value}
          maxLength={maxLength}
          onChange={(e) => setValue(e.target.value)}
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
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      className={baseClasses}
    />
  );
}