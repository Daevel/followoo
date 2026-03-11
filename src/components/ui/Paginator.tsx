import clsx from "clsx";
import { FabIcon } from "./FabIcon";
import { generatePagination } from "../utils/utils";

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
  const pages = generatePagination(currentPage, totalPages);

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex items-center justify-center gap-3"
    >
      <FabIcon
        icon="chevronDoubleLeft"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrevious}
        background="primary"
        foreground="foreground"
      />

      <div className="flex items-center gap-2">
        {pages.map((page, index) => {
          const isEllipsis = page === "...";

          if (isEllipsis) {
            return (
              <span
                key={`ellipsis-${index}`}
                className="inline-flex h-10 min-w-10 items-center justify-center text-foreground"
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
                "inline-flex h-10 min-w-10 items-center justify-center px-3 transition-colors",
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