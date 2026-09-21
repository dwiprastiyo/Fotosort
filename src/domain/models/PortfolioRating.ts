export type PortfolioRating = 1 | 2 | 3 | 4 | 5 | null;

export const RATING_MIN = 1;
export const RATING_MAX = 5;

export function isValidRating(value: unknown): value is PortfolioRating {
  if (value === null) return true;
  if (typeof value === 'number' && Number.isInteger(value)) {
    return value >= RATING_MIN && value <= RATING_MAX;
  }
  return false;
}
