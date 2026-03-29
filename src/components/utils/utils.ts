import { InstagramObjectArrayKeys } from "../../types/enums";
import type {
  InstagramRawUser,
  InstagramUser,
} from "../../types/instagram.types";

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

export function formatDate(timestamp?: number) {
  if (!timestamp) return null;

  const date = new Date(timestamp * 1000);

  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function extractFirstNameLetter(name: string): string {
  for (const letter of name) {
    if (/[a-zA-Z]/.test(letter)) {
      return letter;
    }
  }
  return "?";
}

/**
 *
 * @param arrKey name of the array key of the object
 * @returns true if arrKey is the same of some value placed in InstagramObjectArrayKeys
 */
export function isInstagramArrayKeyPresent(arrKey: string): boolean {
  return Object.values(InstagramObjectArrayKeys).some((key) => key === arrKey);
}

export function normalizeInstagramUser(raw: InstagramRawUser): InstagramUser {
  return {
    username: raw.value,
    href: raw.href,
    timestamp: raw.timestamp,
  };
}

export function getInstagramProfileUrl(user: InstagramUser): string {
  return `https://www.instagram.com/${user.username}/`;
}

export async function ensureMinimumDelay(
  startTime: number,
  minimumDelay: number,
) {
  const elapsed = Date.now() - startTime;
  const remaining = Math.max(0, minimumDelay - elapsed);

  if (remaining > 0) {
    await new Promise((resolve) => setTimeout(resolve, remaining));
  }
}
