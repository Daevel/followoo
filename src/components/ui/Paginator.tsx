import { useEffect, useState } from "react";
import { generatePaginator } from "../utils";
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
          const previousPage = pages[index - 1];
          const nextPage = pages[index + 1];

          if (isEllipsis) {
            return (
              <span
                key={`ellipsis-${previousPage}-${nextPage}`}
                className="text-foreground inline-flex h-9 min-w-8 items-center justify-center text-sm sm:h-10 sm:min-w-10"
              >
                ...
              </span>
            );
          }

          return (
            <button key={`page-${page}`} type="button">
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
