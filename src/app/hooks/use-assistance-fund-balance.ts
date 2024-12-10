import useSWR from 'swr';

type Balance = {
  coin: string;
  token: number;
  total: string;
  hold: string;
  entryNtl: string;
};

type AssistanceFundResponse = {
  balances: Balance[];
};

async function assistanceFundFetcher(url: string) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'spotClearinghouseState',
      user: '0xfefefefefefefefefefefefefefefefefefefefe',
    }),
  });
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  const data: AssistanceFundResponse = await res.json();
  const hypeData = data.balances.find((b) => b.coin === 'HYPE');
  return hypeData ? parseFloat(hypeData.total) : 0;
}

export const useAssistanceFundBalance = () => {
  const { data: assistanceFundBalance = 0, error } = useSWR<number>(
    ['https://api.hyperliquid.xyz/info', 'fetchAssistanceFundBalance'],
    ([url]) => assistanceFundFetcher(url),
    {
      refreshInterval: 2_000,
      fallbackData: 0,
    },
  );

  return {
    assistanceFundBalance: assistanceFundBalance as number, // Force type as number since we have fallback
    error,
    isLoading: !error && !assistanceFundBalance,
  };
};
