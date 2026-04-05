import type { LotteryRecord } from '../types/lottery';

/**
 * Normalizes lottery results into a flat array of numbers.
 * Works for both simple arrays and complex results (like 3D/3D Pro).
 */
export function normalizeResult(result: LotteryRecord['result']): number[] {
  if (Array.isArray(result)) return result as number[];
  if (typeof result === 'object' && result !== null) {
    // For 3D products, flatten all prize numbers into a single array
    return Object.values(result)
      .flat()
      .map((v) => (typeof v === 'string' ? parseInt(v, 10) : v))
      .filter((v) => !isNaN(v));
  }
  return [];
}
