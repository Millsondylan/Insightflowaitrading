/**
 * Generates a random promo code using a mix of uppercase letters and numbers.
 * Excludes ambiguous characters (I, O, 0, 1) to avoid confusion.
 * 
 * @returns A string containing an 8-character promo code
 */
export function generatePromoCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 8 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
} 