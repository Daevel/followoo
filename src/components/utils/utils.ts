import { InstagramObjectArrayKeys } from "../../types/enums";
import type { InstagramRawUser, InstagramUser } from "../../types/instagram.types";

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};

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
