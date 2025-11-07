// Utilities for US phone formatting and validation
export function digitsOnly(input: string): string {
  return input.replace(/\D/g, "");
}

export function formatUSPhone(input: string): string {
  const digits = digitsOnly(input).slice(0, 10);
  if (digits.length === 0) return "";
  if (digits.length <= 3) {
    return `(${digits}`;
  }
  if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function isValidUSPhone(input: string): boolean {
  // Must be exactly in the form (XXX) XXX-XXXX
  return /^\(\d{3}\) \d{3}-\d{4}$/.test(input);
}
