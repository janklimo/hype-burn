import useSWR from 'swr';

import { apiHost } from '@/constant/config';

interface ApiResponse {
  total_fees_hype: number;
}

async function fetchTransactionFees() {
  try {
    const response = await fetch(`${apiHost}/network_metrics`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();

    return data.total_fees_hype;
  } catch (error) {
    console.error('Error fetching network metrics:', error);
    return 0; // Return 0 on error as requested
  }
}

const useBurntEVMBalance = () => {
  const { data, error } = useSWR<number>(
    'networkMetrics',
    fetchTransactionFees,
    {
      refreshInterval: 10_000,
      fallbackData: 0,
      revalidateOnFocus: true,
      dedupingInterval: 2_000,
    },
  );

  return {
    balance: data || 0,
    error,
    isLoading: !error && data === undefined,
  };
};

export default useBurntEVMBalance;
