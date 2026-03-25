'use client';

import useSWR from 'swr';

import { apiHost } from '@/constant/config';

interface PriceData {
  date: string;
  close: number;
}

interface RevenueData {
  date: string;
  total: number;
}

export interface CombinedChartData {
  date: string;
  price: number | null;
  revenue7dMA: number | null;
  revenue30dMA: number | null;
  revenue90dMA: number | null;
}

const fetcher = <T>(url: string): Promise<T> =>
  fetch(url).then((res) => res.json());

function calculateMA(data: RevenueData[], window: number): Map<string, number> {
  const maMap = new Map<string, number>();

  for (let i = 0; i < data.length; i++) {
    if (i < window - 1) {
      continue;
    }

    let sum = 0;
    for (let j = i - window + 1; j <= i; j++) {
      sum += data[j].total;
    }
    maMap.set(data[i].date, sum / window);
  }

  return maMap;
}

export function usePriceRevenueData() {
  const { data: priceData, error: priceError } = useSWR<PriceData[]>(
    `${apiHost}/network_metrics/price`,
    fetcher,
    { refreshInterval: 60000 },
  );

  const { data: revenueData, error: revenueError } = useSWR<RevenueData[]>(
    `${apiHost}/network_metrics/revenues`,
    fetcher,
    { refreshInterval: 60000 },
  );

  const combinedData: CombinedChartData[] | undefined = (() => {
    if (!priceData || !revenueData) return undefined;

    const revenue7dMA = calculateMA(revenueData, 7);
    const revenue30dMA = calculateMA(revenueData, 30);
    const revenue90dMA = calculateMA(revenueData, 90);

    const priceMap = new Map<string, number>();
    priceData.forEach((p) => {
      priceMap.set(p.date, p.close);
    });

    const allDates = new Set<string>();
    priceData.forEach((p) => allDates.add(p.date));
    revenueData.forEach((r) => allDates.add(r.date));

    const sortedDates = Array.from(allDates).sort();

    return sortedDates.map((date) => ({
      date,
      price: priceMap.get(date) ?? null,
      revenue7dMA: revenue7dMA.get(date) ?? null,
      revenue30dMA: revenue30dMA.get(date) ?? null,
      revenue90dMA: revenue90dMA.get(date) ?? null,
    }));
  })();

  return {
    data: combinedData,
    isLoading: !priceData && !revenueData && !priceError && !revenueError,
    error: priceError || revenueError,
  };
}
