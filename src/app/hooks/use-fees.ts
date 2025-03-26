import { useMemo } from 'react';
import useSWR from 'swr';

interface FeeData {
  time: number;
  total_fees: number;
  total_spot_fees: number;
}

async function fetcher(url: string) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return await res.json();
}

const useFees = () => {
  const { data, error } = useSWR<FeeData[]>(
    'https://api.hypurrscan.io/fees',
    fetcher,
    {
      refreshInterval: 10_000,
    },
  );

  const fees = useMemo(() => {
    if (!data || data.length < 2) return null;

    const recentData = data[data.length - 1];
    const oneDayAgo = recentData.time - 24 * 60 * 60;
    const sevenDaysAgo = recentData.time - 7 * 24 * 60 * 60;
    const thirtyDaysAgo = recentData.time - 30 * 24 * 60 * 60;

    const findOldData = (targetTime: number) => {
      let oldIndex = 0;
      for (let i = data.length - 1; i >= 0; i--) {
        if (data[i].time <= targetTime) {
          oldIndex = i;
          break;
        }
      }
      return data[oldIndex + 1] || data[0];
    };

    const oneDayData = findOldData(oneDayAgo);
    const sevenDaysData = findOldData(sevenDaysAgo);
    const thirtyDaysData = findOldData(thirtyDaysAgo);

    return {
      oneDay: (recentData.total_fees - oneDayData.total_fees) / 1_000_000,
      sevenDays:
        (recentData.total_fees - sevenDaysData.total_fees) / 1_000_000 / 7,
      thirtyDays:
        (recentData.total_fees - thirtyDaysData.total_fees) / 1_000_000 / 30,
    };
  }, [data]);

  return {
    fees,
    error,
    isLoading: !error && !data,
  };
};

export default useFees;
