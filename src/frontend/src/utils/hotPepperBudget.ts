/**
 * Maps budget slider values to Hot Pepper API budget codes.
 * Budget codes reference: https://webservice.recruit.co.jp/doc/hotpepper/reference.html
 */

export interface BudgetMapping {
  code: string;
  label: string;
  minPrice: number;
  maxPrice: number;
}

export const BUDGET_MAPPINGS: BudgetMapping[] = [
  { code: 'B009', label: '$', minPrice: 0, maxPrice: 500 },
  { code: 'B010', label: '$$', minPrice: 501, maxPrice: 1000 },
  { code: 'B011', label: '$$$', minPrice: 1001, maxPrice: 1500 },
  { code: 'B001', label: '$$$$', minPrice: 1501, maxPrice: 2000 },
  { code: 'B002', label: '$$$$$', minPrice: 2001, maxPrice: 3000 },
];

/**
 * Convert price range slider values [1-5] to Hot Pepper budget codes.
 * Returns an array of budget codes that fall within the selected range.
 */
export function getBudgetCodesFromRange(range: [number, number]): string[] {
  const [min, max] = range;
  return BUDGET_MAPPINGS
    .filter((_, index) => index + 1 >= min && index + 1 <= max)
    .map((mapping) => mapping.code);
}

/**
 * Get budget code label for display (e.g., "$", "$$", "$$$")
 */
export function getBudgetLabel(level: number): string {
  const mapping = BUDGET_MAPPINGS[level - 1];
  return mapping ? mapping.label : '$';
}
