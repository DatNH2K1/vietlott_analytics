import type { LotteryRecord, FrequencyStat, DaysSinceStat } from '../types/lottery';

type WorkerRequest = {
  fileName: string;
  freqDays?: number;
};

type PrecomputedData = {
  generatedAt: string;
  productId: string;
  records: LotteryRecord[];
  freqAll: FrequencyStat[];
  freq30: FrequencyStat[];
  freq90: FrequencyStat[];
  daysSinceData: DaysSinceStat[];
  totalRecords: number;
};

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const { fileName, freqDays } = event.data;

  // Use precomputed data
  const productId = fileName.split('.')[0];
  const precomputedUrl = `/data/${productId}.precomputed.json`;

  try {
    const response = await fetch(precomputedUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch precomputed data for ${productId}`);
    }
    const data: PrecomputedData = await response.json();

    let freqData = data.freqAll;
    if (freqDays === 30) freqData = data.freq30;
    else if (freqDays === 90) freqData = data.freq90;

    self.postMessage({
      ok: true,
      records: data.records,
      freqData,
      daysSinceData: data.daysSinceData,
    });
  } catch (err) {
    self.postMessage({
      ok: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};
