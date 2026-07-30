export function extractFirstNameLetter(name: string): string {
  for (const letter of name) {
    if (/[a-zA-Z]/.test(letter)) {
      return letter;
    }
  }
  return "?";
}
