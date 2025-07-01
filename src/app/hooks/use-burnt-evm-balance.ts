import useSWR from 'swr';

interface ChartEntry {
  date: string;
  date_to: string;
  value: string;
  is_approximate: boolean;
}

interface ApiResponse {
  chart: ChartEntry[];
  info: {
    id: string;
    title: string;
    description: string;
    units: string;
    resolutions: string[];
  };
}

async function fetchTransactionFees() {
  try {
    const response = await fetch(
      'https://stats-hyperliquid.cloud.blockscout.com/api/v1/lines/txnsFee?resolution=YEAR',
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();

    // Sum all values from the chart array
    const totalFees = data.chart.reduce((sum, entry) => {
      return sum + Number(entry.value);
    }, 0);

    return totalFees;
  } catch (error) {
    console.error('Error fetching transaction fees:', error);
    throw error;
  }
}

const useBurntEVMBalance = () => {
  const { data, error } = useSWR<number>(
    'transactionFees',
    fetchTransactionFees,
    {
      refreshInterval: 5_000,
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
