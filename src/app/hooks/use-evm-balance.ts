import useSWR from 'swr';

interface Balance {
  coin: string;
  token: number;
  total: string;
  hold: string;
  entryNtl: string;
}

interface EVMBalanceState {
  balances: Balance[];
}

async function fetcher(url: string) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'spotClearinghouseState',
      user: '0x2222222222222222222222222222222222222222',
    }),
  });

  if (!res.ok) {
    throw new Error('Network response was not ok');
  }

  const data: EVMBalanceState = await res.json();
  const balance = data.balances.find((b) => b.coin === 'HYPE')?.total || '0';
  return Number(balance);
}

const useEVMBalance = () => {
  const { data, error } = useSWR<number>(
    ['https://api.hyperliquid.xyz/info', 'fetchEVMBalance'],
    ([url]) => fetcher(url),
    {
      refreshInterval: 2_000,
      fallbackData: 0,
    },
  );

  return {
    evmBalance: data || 0,
    error,
    isLoading: !error && !data,
  };
};

export default useEVMBalance;
