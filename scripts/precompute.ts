import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PRODUCTS } from '../src/types/lottery.ts';
import type {
  LotteryRecord,
  FrequencyStat,
  DaysSinceStat,
  DataOverviewStat,
} from '../src/types/lottery.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const RAW_DATA_DIR = path.join(PROJECT_ROOT, 'data');
const OUTPUT_DATA_DIR = path.join(PROJECT_ROOT, 'public', 'data');

/**
 * Precomputed data structure
 */
interface PrecomputedData {
  generatedAt: string;
  productId: string;
  overview: DataOverviewStat;
  records: LotteryRecord[];
  freqAll: FrequencyStat[];
  freq30: FrequencyStat[];
  freq90: FrequencyStat[];
  daysSinceData: DaysSinceStat[];
  totalRecords: number;
}

type LotteryResult = number[] | Record<string, string[] | number[]>;

function parseNDJSON<T>(text: string): T[] {
  if (!text) return [];
  return text
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line) => {
      try {
        return JSON.parse(line) as T;
      } catch {
        return null;
      }
    })
    .filter((v): v is T => v !== null);
}

function calculateFrequency(records: LotteryRecord[], daysLimit?: number): FrequencyStat[] {
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

  for (const record of filteredRecords) {
    const rawResult = record.result as LotteryResult;
    let flatResult: (number | string)[] = [];

    if (rawResult && typeof rawResult === 'object' && !Array.isArray(rawResult)) {
      flatResult = Object.values(rawResult).flat();
    } else if (Array.isArray(rawResult)) {
      flatResult = rawResult;
    }

    if (!flatResult || flatResult.length === 0) continue;

    for (const val of flatResult) {
      const num = typeof val === 'string' ? parseInt(val, 10) : (val as number);
      if (isNaN(num)) continue;
      counts[num] = (counts[num] || 0) + 1;
      totalNumbers++;
    }
  }

  const stats: FrequencyStat[] = Object.entries(counts).map(([num, count]) => ({
    number: parseInt(num, 10),
    count,
    percentage: totalNumbers > 0 ? parseFloat(((count / totalNumbers) * 100).toFixed(2)) : 0,
  }));

  return stats.sort((a, b) => a.number - b.number);
}

function calculateDaysSince(records: LotteryRecord[]): DaysSinceStat[] {
  if (records.length === 0) return [];
  const sortedRecords = [...records].sort((a, b) => b.date.localeCompare(a.date));
  const latestDate = new Date(sortedRecords[0].date);

  const lastAppearances: Record<number, string> = {};
  const allNumbers = new Set<number>();

  for (const record of records) {
    const rawResult = record.result as LotteryResult;
    let flatResult: (number | string)[] = [];
    if (rawResult && typeof rawResult === 'object' && !Array.isArray(rawResult)) {
      flatResult = Object.values(rawResult).flat();
    } else if (Array.isArray(rawResult)) {
      flatResult = rawResult;
    }
    if (!flatResult || flatResult.length === 0) continue;

    for (const val of flatResult) {
      const num = typeof val === 'string' ? parseInt(val, 10) : (val as number);
      if (isNaN(num)) continue;
      allNumbers.add(num);
    }
  }

  for (const record of sortedRecords) {
    const rawResult = record.result as LotteryResult;
    let flatResult: (number | string)[] = [];
    if (rawResult && typeof rawResult === 'object' && !Array.isArray(rawResult)) {
      flatResult = Object.values(rawResult).flat();
    } else if (Array.isArray(rawResult)) {
      flatResult = rawResult;
    }
    if (!flatResult || flatResult.length === 0) continue;

    for (const val of flatResult) {
      const num = typeof val === 'string' ? parseInt(val, 10) : (val as number);
      if (isNaN(num)) continue;
      if (!lastAppearances[num]) lastAppearances[num] = record.date;
    }
  }

  const stats: DaysSinceStat[] = Array.from(allNumbers).map((num) => {
    const lastDateStr = lastAppearances[num];
    const lastDate = new Date(lastDateStr);
    const diffTime = Math.abs(latestDate.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return { number: num, lastDate: lastDateStr, daysSince: diffDays };
  });

  return stats.sort((a, b) => b.daysSince - a.daysSince);
}

async function precompute() {
  console.log('🚀 Starting pre-computation of lottery data (TypeScript version)...');
  const start = Date.now();
  const summary: DataOverviewStat[] = [];

  if (!fs.existsSync(RAW_DATA_DIR)) {
    console.error(`❌ Raw data directory not found: ${RAW_DATA_DIR}`);
    process.exit(1);
  }

  if (!fs.existsSync(OUTPUT_DATA_DIR)) {
    fs.mkdirSync(OUTPUT_DATA_DIR, { recursive: true });
  }

  for (const product of PRODUCTS) {
    const filePath = path.join(RAW_DATA_DIR, product.fileName);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ File not found: ${filePath}`);
      continue;
    }

    console.log(`📦 Processing ${product.id}...`);
    const content = fs.readFileSync(filePath, 'utf-8');
    const allRecords = parseNDJSON<LotteryRecord>(content);

    // Sort records by date descending
    allRecords.sort((a, b) => b.date.localeCompare(a.date));

    // Calculate stats
    const freqAll = calculateFrequency(allRecords);
    const freq30 = calculateFrequency(allRecords, 30);
    const freq90 = calculateFrequency(allRecords, 90);
    const daysSinceData = calculateDaysSince(allRecords);

    const latestDate = allRecords.length > 0 ? allRecords[0].date : null;
    const recentRecords = latestDate ? allRecords.filter((r) => r.date === latestDate) : [];

    const dates = allRecords.map((r) => r.date).sort();
    const uniqueDatesCount = new Set(dates).size;

    const overview: DataOverviewStat = {
      productId: product.id,
      name: product.displayName,
      totalDraws: uniqueDatesCount,
      startDate: dates[0] || 'N/A',
      endDate: dates[dates.length - 1] || 'N/A',
      totalRecords: allRecords.length,
    };

    summary.push(overview);

    const output: PrecomputedData = {
      generatedAt: new Date().toISOString(),
      productId: product.id,
      overview,
      records: recentRecords,
      freqAll,
      freq30,
      freq90,
      daysSinceData,
      totalRecords: allRecords.length,
    };

    const outputPath = path.join(OUTPUT_DATA_DIR, `${product.id}.precomputed.json`);
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    console.log(
      `✅ Saved precomputed data for ${product.id} to ${path.basename(outputPath)} (${(Buffer.byteLength(JSON.stringify(output)) / 1024).toFixed(2)} KB)`,
    );
  }

  // Save summary.precomputed.json
  const summaryPath = path.join(OUTPUT_DATA_DIR, 'summary.precomputed.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log(
    `📊 Generated summary for ${summary.length} products to ${path.basename(summaryPath)}`,
  );

  const end = Date.now();
  console.log(`✨ Pre-computation complete in ${((end - start) / 1000).toFixed(2)}s`);
}

precompute().catch((err) => {
  console.error('❌ Error during pre-computation:', err);
  process.exit(1);
});
