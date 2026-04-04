/**
 * Extracts the first alphabetic letter from a string
 * Used for generating user initials
 */
export function extractFirstNameLetter(name: string): string {
  for (const letter of name) {
    if (/[a-zA-Z]/.test(letter)) {
      return letter;
    }
  }
  return "?";
}
