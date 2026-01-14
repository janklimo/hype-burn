'use client';

import useSWR from 'swr';

interface PriceData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  trades: number;
}

interface RevenueData {
  date: string;
  'HyperCore Buybacks': number;
  'HyperEVM Burn': number;
  'Auction Burn': number;
  total: number;
}

interface RevenueResponse {
  summary: {
    total_revenue: number;
    total_hypercore_buybacks: number;
    total_hypervm_burn: number;
    total_auction_burn: number;
    average_daily_revenue: number;
    annualized_revenue: number;
    days_tracked: number;
    start_date: string;
    end_date: string;
  };
  data: RevenueData[];
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
      // Not enough data for MA yet
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
    'https://api-hyperliquid.asxn.xyz/api/buyback/hype-price',
    fetcher,
    { refreshInterval: 60000 },
  );

  const { data: revenueResponse, error: revenueError } =
    useSWR<RevenueResponse>(
      'https://api-hyperliquid.asxn.xyz/api/buyback/revenues',
      fetcher,
      { refreshInterval: 60000 },
    );

  const combinedData: CombinedChartData[] | undefined = (() => {
    if (!priceData || !revenueResponse) return undefined;

    const revenueData = revenueResponse.data;
    const revenue7dMA = calculateMA(revenueData, 7);
    const revenue30dMA = calculateMA(revenueData, 30);
    const revenue90dMA = calculateMA(revenueData, 90);

    // Create a map for price data by date
    const priceMap = new Map<string, number>();
    priceData.forEach((p) => {
      priceMap.set(p.date, p.close);
    });

    // Get all unique dates
    const allDates = new Set<string>();
    priceData.forEach((p) => allDates.add(p.date));
    revenueData.forEach((r) => allDates.add(r.date));

    // Sort dates and combine data
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
    isLoading: !priceData && !revenueResponse && !priceError && !revenueError,
    error: priceError || revenueError,
  };
}
