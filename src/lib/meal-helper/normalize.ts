// ─── Arabic text normalization for keyword matching ──────────────────────────
//
// Menus spell the same word many ways ("فرخة" / "فرخه", "أرز" / "ارز",
// "ساندوتش" / "سندوتش"). Everything the meal helper matches — product text and
// its own keyword lists — goes through this first, so one keyword covers them.

const TASHKEEL = /[ً-ٰٟ]/g; // harakat, shadda, sukun, dagger alif
const TATWEEL = /ـ/g;
const ARABIC_DIGITS = /[٠-٩]/g;

export function normalizeArabic(text: string | null | undefined): string {
  return (text ?? "")
    .replace(TASHKEEL, "")
    .replace(TATWEEL, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(ARABIC_DIGITS, (d) => String(d.charCodeAt(0) - 0x0660))
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}
