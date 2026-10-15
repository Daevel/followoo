import clsx from "clsx";
import { useEffect, useState } from "react";
import { generatePaginator } from "@/lib";
import { FabIcon } from "./FabIcon";

type PaginatorProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Paginator({
  currentPage,
  totalPages,
  onPageChange,
}: PaginatorProps) {
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

  const pages = generatePaginator(currentPage, totalPages, isMobile ? 3 : 5);

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <nav
      aria-label="Paginator"
      className="mt-10 flex items-center justify-center gap-1"
    >
      <FabIcon
        icon="singleArrowLeft"
        aria-label="Previous page"
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrevious}
      />

      <div className="flex items-center gap-1">
        {pages.map((page, index) => {
          const isEllipsis = page === "...";
          const previousPage = pages[index - 1];
          const nextPage = pages[index + 1];

          if (isEllipsis) {
            return (
              <span
                key={`ellipsis-${previousPage}-${nextPage}`}
                className="text-fg-faint inline-flex h-8 min-w-6 items-center justify-center text-[13px]"
              >
                ...
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <button
              key={`page-${page}`}
              type="button"
              onClick={() => typeof page === "number" && onPageChange(page)}
              aria-current={isActive ? "page" : undefined}
              className={clsx(
                "inline-flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-lg border px-2 text-[13px] font-medium tabular-nums transition-colors",
                "focus-visible:shadow-ring focus-visible:outline-none",
                isActive
                  ? "border-line-strong bg-surface-2 text-fg"
                  : "text-fg-muted hover:bg-surface-2 hover:text-fg border-transparent"
              )}
            >
              {page}
            </button>
          );
        })}
      </div>

      <FabIcon
        icon="singleArrowRight"
        aria-label="Next page"
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
      />
    </nav>
  );
}
