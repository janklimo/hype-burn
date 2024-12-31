import useSWR from 'swr';

type Validator = {
  validator: string;
  signer: string;
  name: string;
  description: string;
  nRecentBlocks: number;
  stake: number;
  isJailed: boolean;
  unjailableAfter: null | string;
  isActive: boolean;
  commission: string;
};

async function stakedBalanceFetcher(url: string) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'validatorSummaries',
    }),
  });

  if (!res.ok) {
    throw new Error('Network response was not ok');
  }

  const data: Validator[] = await res.json();

  // Sum all stake values and convert from wei (divide by 0.00000001)
  const totalStake =
    data.reduce((sum, validator) => sum + validator.stake, 0) * 0.00000001;

  return totalStake;
}

export const useStakedBalance = () => {
  const { data: stakedBalance = 0, error } = useSWR<number>(
    ['https://api.hyperliquid.xyz/info', 'fetchStakedBalance'],
    ([url]) => stakedBalanceFetcher(url),
    {
      refreshInterval: 2_000,
      fallbackData: 0,
    },
  );

  return {
    stakedBalance: stakedBalance as number, // Force type as number since we have fallback
    error,
    isLoading: !error && !stakedBalance,
  };
};
