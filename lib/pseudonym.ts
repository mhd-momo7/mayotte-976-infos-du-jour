export const PSEUDONYM_HINT = "3 à 20 caractères : lettres, chiffres, « _ », « . » ou « - ».";

const PSEUDONYM_PATTERN = /^[A-Za-z0-9_.-]{3,20}$/;

export function isValidPseudonym(value: string): boolean {
  return PSEUDONYM_PATTERN.test(value);
}
