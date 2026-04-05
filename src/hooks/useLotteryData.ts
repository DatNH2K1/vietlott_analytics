import { useState, useEffect } from 'react';
import type { DataOverviewStat } from '../types/lottery';

const summaryCache: { data: DataOverviewStat[] | null } = { data: null };

const getInitialSummary = () => {
  if (!summaryCache.data) return {};
  const dict: Record<string, DataOverviewStat> = {};
  summaryCache.data.forEach((item) => {
    dict[item.productId] = item;
  });
  return dict;
};

export function useAllLotteryData() {
  const [results, setResults] = useState<Record<string, DataOverviewStat>>(getInitialSummary);
  const [loading, setLoading] = useState<boolean>(!summaryCache.data);

  useEffect(() => {
    let isMounted = true;

    if (summaryCache.data) return;

    fetch('/data/summary.precomputed.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch summary');
        return res.json();
      })
      .then((data: DataOverviewStat[]) => {
        summaryCache.data = data;
        if (isMounted) {
          const dict: Record<string, DataOverviewStat> = {};
          data.forEach((item) => {
            dict[item.productId] = item;
          });
          setResults(dict);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { results, loading };
}
