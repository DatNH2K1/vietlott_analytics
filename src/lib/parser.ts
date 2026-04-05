import type { LotteryRecord } from '../types/lottery';

/**
 * NDJSON to JSON parser
 * @param text The NDJSON string
 * @returns Array of objects
 */
export function parseNDJSON<T>(text: string): T[] {
  if (!text) return [];
  return text
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line) => {
      try {
        return JSON.parse(line) as T;
      } catch (e) {
        console.error('Error parsing NDJSON line:', e, line);
        return null as unknown as T;
      }
    })
    .filter(Boolean);
}

/**
 * Fetch and parse lottery data
 * @param fileName
 * @returns
 */
export async function fetchLotteryData(fileName: string): Promise<LotteryRecord[]> {
  const response = await fetch(`/data/${fileName}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch data for ${fileName}`);
  }
  const text = await response.text();
  return parseNDJSON<LotteryRecord>(text);
}
