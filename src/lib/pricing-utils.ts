/**
 * Shared pricing utility functions
 */

/**
 * Calculate the discounted price given an original price and discount percentage
 * @param price - The original price
 * @param discount - The discount percentage (e.g., 20 for 20%)
 * @returns The discounted price, rounded to 2 decimal places
 */
export function getDiscountedPrice(price: number, discount: number): number {
  const discountedPrice = price - (price * discount) / 100;
  return parseFloat(discountedPrice.toFixed(2));
}

/**
 * Calculate the amount saved with a discount
 * @param price - The original price
 * @param discount - The discount percentage
 * @returns The amount saved
 */
export function getDiscountSavings(price: number, discount: number): number {
  return price - getDiscountedPrice(price, discount);
}

/**
 * Resolve the effective discount percentage for a product.
 *
 * The backend expresses a discount in one of two ways and not always both:
 *   • an explicit `discount` percentage field, or
 *   • only a reduced `price_after` (with `discount` left at 0/empty).
 *
 * This prefers the explicit percentage; when it's missing it derives the
 * percentage from the gap between the original `price` and `price_after`.
 * Returns 0 when there is no discount.
 *
 * @param price - The original (pre-discount) price
 * @param discount - The explicit discount percentage, if any (string|number)
 * @param priceAfter - The discounted price, if the API provided one
 */
export function getEffectiveDiscount(
  price: number,
  discount?: string | number | null,
  priceAfter?: number | null,
): number {
  const explicit = discount != null ? parseFloat(String(discount)) : 0;
  if (Number.isFinite(explicit) && explicit > 0) return explicit;

  if (
    priceAfter != null &&
    Number.isFinite(priceAfter) &&
    price > 0 &&
    priceAfter < price
  ) {
    return parseFloat((((price - priceAfter) / price) * 100).toFixed(4));
  }

  return 0;
}

/**
 * Format price with currency
 * @param price - The price to format
 * @param currency - The currency symbol (default from constants)
 * @returns Formatted price string
 */
export function formatPrice(price: number, currency: string): string {
  return `${price.toFixed(2)} ${currency}`;
}
