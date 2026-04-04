export function generatePagination(
  currentPage: number,
  totalPages: number,
  maxVisiblePages: number,
): Array<number | "..."> {
  if (totalPages <= maxVisiblePages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: Array<number | "..."> = [];
  const innerVisibleCount = maxVisiblePages - 2; // first + last
  const half = Math.floor(innerVisibleCount / 2);

  let start = Math.max(2, currentPage - half);
  let end = Math.min(totalPages - 1, currentPage + half);

  if (currentPage <= half + 2) {
    start = 2;
    end = 1 + innerVisibleCount;
  }

  if (currentPage >= totalPages - (half + 1)) {
    end = totalPages - 1;
    start = totalPages - innerVisibleCount;
  }

  pages.push(1);

  if (start > 2) {
    pages.push("...");
  }

  for (let page = start; page <= end; page++) {
    pages.push(page);
  }

  if (end < totalPages - 1) {
    pages.push("...");
  }

  pages.push(totalPages);

  return pages;
}
