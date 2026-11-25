import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { useDropdownMenuAnimation } from "@/animations/hooks/useDropdownMenuAnimation";
import { type ThemePreference, useTheme } from "@/providers/ThemeProvider";
import { FabIcon } from "./FabIcon";
import { Icon, type IconName } from "./Icon";

const OPTIONS: { value: ThemePreference; label: string; icon: IconName }[] = [
  { value: "system", label: "System", icon: "monitor" },
  { value: "light", label: "Light", icon: "sun" },
  { value: "dark", label: "Dark", icon: "moon" },
];

const optionOf = (value: ThemePreference) =>
  OPTIONS.find((option) => option.value === value) ?? OPTIONS[0];

/** Navbar icon (desktop) that opens a System / Light / Dark menu. */
export function ThemeMenu() {
  const { preference, setPreference } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const current = optionOf(preference);

  useDropdownMenuAnimation(menuRef, isOpen, "top right");

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div ref={rootRef} className="relative">
      <FabIcon
        icon={current.icon}
        variant="ghost"
        size="sm"
        aria-label={`Theme: ${current.label}`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      />

      {isOpen && (
        <div
          ref={menuRef}
          role="menu"
          aria-label="Theme"
          className="border-line-strong bg-surface-2 shadow-elev-2 absolute top-full right-0 z-50 mt-1.5 flex w-44 flex-col rounded-[12px] border p-1"
        >
          {OPTIONS.map((option) => {
            const isActive = option.value === preference;

            return (
              <button
                key={option.value}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                onClick={() => {
                  setPreference(option.value);
                  setIsOpen(false);
                }}
                className={clsx(
                  "flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-start text-sm transition-colors duration-150",
                  "hover:bg-line-subtle focus-visible:shadow-ring focus-visible:outline-none",
                  isActive ? "text-fg" : "text-fg-muted hover:text-fg"
                )}
              >
                <Icon
                  name={option.icon}
                  color="current"
                  width={16}
                  height={16}
                  aria-hidden="true"
                />
                <span className="flex-1">{option.label}</span>
                {isActive && (
                  <Icon
                    name="check"
                    color="current"
                    width={14}
                    height={14}
                    className="text-brand-fg"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** Phone menu row: the same three choices side by side. */
export function ThemeSwitch() {
  const { preference, setPreference } = useTheme();

  return (
    <fieldset className="m-0 flex min-w-0 items-center justify-between gap-3 border-0 px-2 py-0">
      <legend className="sr-only">Theme</legend>
      <span aria-hidden="true" className="text-fg-muted text-sm">
        Theme
      </span>
      <div className="border-line-subtle bg-surface-1 inline-flex gap-0.5 rounded-xl border p-[3px]">
        {OPTIONS.map((option) => {
          const isActive = option.value === preference;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isActive}
              onClick={() => setPreference(option.value)}
              className={clsx(
                "ease-motion-out flex items-center gap-1.5 rounded-[9px] px-2.5 py-1.5 text-[13px] font-medium transition-colors duration-150",
                "focus-visible:shadow-ring focus-visible:outline-none",
                isActive
                  ? "bg-surface-2 text-fg shadow-elev-1"
                  : "text-fg-muted hover:text-fg"
              )}
            >
              <Icon
                name={option.icon}
                color="current"
                width={14}
                height={14}
                aria-hidden="true"
              />
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
