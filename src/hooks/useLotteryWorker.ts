import { useEffect, useState } from 'react';
import type { LotteryRecord, FrequencyStat, DaysSinceStat } from '../types/lottery';

interface WorkerResult {
  records: LotteryRecord[];
  freqData: FrequencyStat[];
  daysSinceData: DaysSinceStat[];
  loading: boolean;
  error: string | null;
}

interface PrecomputedData {
  records: LotteryRecord[];
  freqAll: FrequencyStat[];
  freq30: FrequencyStat[];
  freq90: FrequencyStat[];
  daysSinceData: DaysSinceStat[];
}

const cache: Record<string, PrecomputedData> = {};

export function useLotteryWorker(productId: string, freqDays?: number): WorkerResult {
  const [data, setData] = useState<PrecomputedData | null>(() => cache[productId] || null);
  const [freqData, setFreqData] = useState<FrequencyStat[]>([]);
  const [loading, setLoading] = useState<boolean>(!cache[productId]);
  const [error, setError] = useState<string | null>(null);

  // Effect 1: Fetching data when productId changes
  useEffect(() => {
    if (!productId) return;

    if (cache[productId]) {
      setData(cache[productId]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setData(null);
    setError(null);

    const controller = new AbortController();
    const precomputedUrl = `/data/${productId}.precomputed.json`;

    (async () => {
      try {
        const response = await fetch(precomputedUrl, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Failed to fetch precomputed data for ${productId}`);
        }
        const result = await response.json();
        cache[productId] = result;
        setData(result);
        setLoading(false);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [productId]);

  // Effect 2: Updating selection when data or freqDays changes (No Network)
  useEffect(() => {
    if (!data) return;

    let selectedFreq = data.freqAll;
    if (freqDays === 30) selectedFreq = data.freq30;
    else if (freqDays === 90) selectedFreq = data.freq90;

    setFreqData(selectedFreq);
  }, [data, freqDays]);

  return {
    records: data?.records || [],
    freqData,
    daysSinceData: data?.daysSinceData || [],
    loading,
    error,
  };
}
