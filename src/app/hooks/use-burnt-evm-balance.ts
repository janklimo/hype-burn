import useSWR from 'swr';

interface ChartDataEntry {
  date: string;
  transaction_count: number;
  successful_transactions: number;
  success_rate_pct: number;
  fees_hype_total: number;
  fees_hype_base: number;
  fees_hype_priority: number;
  base_fee_pct: number;
  priority_fee_pct: number;
  hype_price_usd: number;
  fees_usd_total: number;
  fees_usd_base: number;
  fees_usd_priority: number;
  avg_fee_hype_per_tx: number;
  avg_fee_usd_per_tx: number;
  avg_gas_price_gwei: number;
  avg_base_fee_gwei: number;
  avg_priority_fee_gwei: number;
  avg_gas_used: number;
  tps: number;
}

interface ApiResponse {
  average_daily_fees_usd: number;
  average_base_fees_usd: number;
  average_priority_fees_usd: number;
  average_base_fee_percentage: number;
  average_success_rate: number;
  average_tps: number;
  average_daily_transactions: number;
  total_fees_usd: number;
  total_base_fees_usd: number;
  total_priority_fees_usd: number;
  time_range: string;
  data_points: number;
  chart_data: ChartDataEntry[];
  last_updated: string;
}

async function fetchTransactionFees() {
  try {
    const response = await fetch(
      'https://api-hyperliquid.asxn.xyz/api/hyper-evm/network-metrics?time_range=all',
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();

    // Sum all fees_hype_total values from the chart_data array
    const totalBurntHype = data.chart_data.reduce((sum, entry) => {
      return sum + entry.fees_hype_total;
    }, 0);

    return totalBurntHype;
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
