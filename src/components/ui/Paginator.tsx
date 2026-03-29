import clsx from "clsx";
import { useEffect, useState } from "react";
import { generatePagination } from "../utils/utils";
import { FabIcon } from "./FabIcon";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");

    const updateIsMobile = () => {
      setIsMobile(mediaQuery.matches);
    };

    updateIsMobile();
    mediaQuery.addEventListener("change", updateIsMobile);

    return () => {
      mediaQuery.removeEventListener("change", updateIsMobile);
    };
  }, []);

  const pages = generatePagination(currentPage, totalPages, isMobile ? 3 : 5);

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex items-center justify-center gap-2 sm:gap-3"
    >
      <FabIcon
        icon="chevronDoubleLeft"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrevious}
        background="primary"
        foreground="foreground"
      />

      <div className="flex items-center gap-1.5 sm:gap-2">
        {pages.map((page, index) => {
          const isEllipsis = page === "...";

          if (isEllipsis) {
            return (
              <span
                key={`ellipsis-${index}`}
                className="text-foreground inline-flex h-9 min-w-8 items-center justify-center text-sm sm:h-10 sm:min-w-10"
              >
                ...
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <button
              key={page}
              type="button"
              onClick={() => typeof page === "number" && onPageChange(page)}
              aria-current={isActive ? "page" : undefined}
              className={clsx(
                "inline-flex h-9 min-w-9 items-center justify-center rounded-[10px] px-2.5 text-sm transition-colors sm:h-10 sm:min-w-10 sm:px-3",
                isActive
                  ? "bg-accent text-foreground"
                  : "bg-primary text-foreground hover:opacity-90",
              )}
            >
              {page}
            </button>
          );
        })}
      </div>

      <FabIcon
        icon="chevronDoubleRight"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
        background="primary"
        foreground="foreground"
      />
    </nav>
  );
}
