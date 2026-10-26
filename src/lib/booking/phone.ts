// Light phone check before booking. The server is the authority (it accepts `+?[0-9 ]{8,20}`);
// this only catches typos and turns Arabic-Indic digits into the ASCII digits it expects.

const ARABIC_INDIC = "٠١٢٣٤٥٦٧٨٩";
const PERSIAN = "۰۱۲۳۴۵۶۷۸۹";

/** "٠١٠ ١٢٣٤ ٥٦٧٨" → "01012345678"; keeps one leading "+", drops spaces, dashes and the rest. */
export function normalizePhone(input: string): string {
  const ascii = String(input ?? "").replace(/[٠-٩۰-۹]/g, (ch) => {
    const i = ARABIC_INDIC.indexOf(ch);
    return String(i >= 0 ? i : PERSIAN.indexOf(ch));
  });
  const trimmed = ascii.trim();
  const plus = trimmed.startsWith("+") ? "+" : "";
  return plus + trimmed.replace(/\D/g, "");
}

/**
 * Egyptian mobiles (01[0125] + 8 digits, also as +20 / 0020 / 20) must be complete; other
 * international numbers only need 8–15 digits.
 */
export function isLikelyPhone(input: string): boolean {
  const n = normalizePhone(input);
  const digits = n.replace(/^\+/, "").replace(/^00/, "");
  if (!/^\d{8,15}$/.test(digits)) return false;
  if (digits.startsWith("01")) return /^01[0125]\d{8}$/.test(digits);
  if (digits.startsWith("201")) return /^201[0125]\d{8}$/.test(digits);
  if (digits.startsWith("1") && !n.startsWith("+")) return /^1[0125]\d{8}$/.test(digits);
  return true;
}
