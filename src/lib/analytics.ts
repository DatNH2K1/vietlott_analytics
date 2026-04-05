import type {
  LotteryRecord,
  FrequencyStat,
  DaysSinceStat,
  DataOverviewStat,
} from '../types/lottery';
import { normalizeResult } from './utils';

/**
 * Calculates number frequency from lottery records
 */
export function calculateFrequency(records: LotteryRecord[], daysLimit?: number): FrequencyStat[] {
  if (records.length === 0) return [];

  let filteredRecords = records;
  if (daysLimit) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysLimit);
    const cutoffStr = cutoffDate.toISOString().split('T')[0];
    filteredRecords = records.filter((r) => r.date >= cutoffStr);
  }

  const counts: Record<number, number> = {};
  let totalNumbers = 0;

  filteredRecords.forEach((record) => {
    const balls = normalizeResult(record.result);
    balls.forEach((num) => {
      counts[num] = (counts[num] || 0) + 1;
      totalNumbers++;
    });
  });

  const stats: FrequencyStat[] = Object.entries(counts).map(([num, count]) => ({
    number: parseInt(num),
    count,
    percentage: parseFloat(((count / totalNumbers) * 100).toFixed(2)),
  }));

  return stats.sort((a, b) => a.number - b.number);
}

/**
 * Calculates days since each number's last appearance
 */
export function calculateDaysSince(records: LotteryRecord[]): DaysSinceStat[] {
  if (records.length === 0) return [];

  // Sort records by date descending
  const sortedRecords = [...records].sort((a, b) => b.date.localeCompare(a.date));
  const latestDate = new Date(sortedRecords[0].date);

  const lastAppearances: Record<number, string> = {};
  const allNumbers = new Set<number>();

  records.forEach((r) => normalizeResult(r.result).forEach((n) => allNumbers.add(n)));

  sortedRecords.forEach((record) => {
    const balls = normalizeResult(record.result);
    balls.forEach((num) => {
      if (!lastAppearances[num]) {
        lastAppearances[num] = record.date;
      }
    });
  });

  const stats: DaysSinceStat[] = Array.from(allNumbers).map((num) => {
    const lastDateStr = lastAppearances[num];
    const lastDate = new Date(lastDateStr);
    const diffTime = Math.abs(latestDate.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      number: num,
      lastDate: lastDateStr,
      daysSince: diffDays,
    };
  });

  return stats.sort((a, b) => b.daysSince - a.daysSince);
}

/**
 * Generates summary statistics for a product
 */
export function getProductSummary(
  productId: string,
  name: string,
  records: LotteryRecord[],
): DataOverviewStat {
  if (records.length === 0) {
    return {
      productId,
      name,
      totalDraws: 0,
      startDate: 'N/A',
      endDate: 'N/A',
      totalRecords: 0,
    };
  }

  const dates = records.map((r) => r.date).sort();

  // For totalDraws, it's the number of unique dates
  const uniqueDatesCount = new Set(dates).size;

  return {
    productId,
    name,
    totalDraws: uniqueDatesCount,
    startDate: dates[0],
    endDate: dates[dates.length - 1],
    totalRecords: records.length,
  };
}
