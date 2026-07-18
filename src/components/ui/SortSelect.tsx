import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useDropdownMenuAnimation } from "@/animations/hooks/useDropdownMenuAnimation";
import { Icon } from "./Icon";

type SelectOption<T extends string> = {
  label: string;
  value: T;
};

type SortSelectProps<T extends string> = {
  label?: string;
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  className?: string;
};

export function SortSelect<T extends string>({
  label = "Select",
  value,
  options,
  onChange,
  className,
}: SortSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const selectedOption = options.find((option) => option.value === value);
  useDropdownMenuAnimation(menuRef, isOpen);

  const updateMenuPosition = useCallback(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();

    setMenuPosition({
      top: rect.bottom + 8 + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    updateMenuPosition();

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (
        rootRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }

      setIsOpen(false);
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    function handleReposition() {
      updateMenuPosition();
    }

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [isOpen, updateMenuPosition]);

  return (
    <>
      <div
        ref={rootRef}
        className={clsx(
          "inline-flex w-full flex-col items-start gap-2 md:w-auto",
          className
        )}
      >
        <span className="l2-r text-foreground/80 text-start">{label}</span>
        <div className="relative w-full min-w-44 md:w-auto">
          <button
            ref={triggerRef}
            type="button"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            onClick={(e) => {
              e.stopPropagation();
              if (!isOpen) {
                updateMenuPosition();
              }
              setIsOpen((prev) => !prev);
            }}
            className={clsx(
              "border-primary bg-primary text-foreground flex w-full items-center justify-between gap-3 rounded-[10px] border px-4 py-2 transition-colors",
              "focus:ring-primary hover:opacity-95 focus:ring-2 focus:outline-none"
            )}
          >
            <span>{selectedOption?.label ?? "Select"}</span>

            <Icon
              name="singleArrowRight"
              color="foreground"
              width={24}
              height={24}
              className={clsx(
                "shrink-0 transition-transform duration-200",
                isOpen && "rotate-90"
              )}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      {isOpen &&
        menuPosition &&
        createPortal(
          <div
            ref={menuRef}
            role="listbox"
            style={{
              position: "absolute",
              top: menuPosition.top,
              left: menuPosition.left,
              width: menuPosition.width,
              zIndex: 9999,
            }}
            className="border-primary bg-bg origin-top rounded-b-[10px] border shadow-lg"
          >
            <div className="flex flex-col py-1">
              {options.map((option) => {
                const isSelected = option.value === value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={clsx(
                      "px-4 py-3 text-left transition-colors",
                      isSelected
                        ? "bg-accent text-foreground"
                        : "text-foreground hover:bg-primary/20"
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
