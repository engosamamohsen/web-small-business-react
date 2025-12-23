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
 * Format price with currency
 * @param price - The price to format
 * @param currency - The currency symbol (default from constants)
 * @returns Formatted price string
 */
export function formatPrice(price: number, currency: string): string {
  return `${price.toFixed(2)} ${currency}`;
}
