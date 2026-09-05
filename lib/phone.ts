/** Formats digits as a Brazilian phone number while typing: (11) 91234-5678 */
export function formatBrPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  const len = digits.length;

  if (len === 0) return "";
  if (len <= 2) return `(${digits}`;
  if (len <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (len <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

/** Normalizes a formatted BR phone into E.164-ish digits for storage: 5511912345678 */
export function normalizeBrPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("55") && digits.length >= 12) return digits;
  return `55${digits}`;
}

export function isValidBrPhone(raw: string): boolean {
  const digits = raw.replace(/\D/g, "");
  return digits.length === 10 || digits.length === 11;
}
