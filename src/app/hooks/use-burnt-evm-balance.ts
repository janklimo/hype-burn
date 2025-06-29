import useSWR from 'swr';
import { formatEther } from 'viem';

import { publicClient } from '@/utils/evm';

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000' as const;

async function fetchNativeBalance(address: string) {
  try {
    const balance = await publicClient.getBalance({
      address: address as `0x${string}`,
    });

    return Number(formatEther(balance));
  } catch (error) {
    console.error('Error fetching native balance:', error);
    throw error;
  }
}

const useBurntEVMBalance = (address: string = NULL_ADDRESS) => {
  const { data, error } = useSWR<number>(
    ['nativeBalance', address],
    ([, addr]: [string, string]) => fetchNativeBalance(addr),
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
