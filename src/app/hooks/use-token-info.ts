import { useEffect, useState } from 'react';
import useSWR from 'swr';

import { apiHost } from '@/constant/config';

interface TokenInfo {
  totalSupply: string;
  circulatingSupply: string;
  futureEmissions: string;
  nonCirculatingUserBalances: [string, string][];
}

async function fetcher(url: string) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tokenId: '0x0d01dc56dcaaca66ad901c959b4011ec',
      type: 'tokenDetails',
    }),
  });

  if (!res.ok) {
    throw new Error('Network response was not ok');
  }

  return await res.json();
}

const useTokenInfo = () => {
  const [initialData, setInitialData] = useState<TokenInfo | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await fetch(`${apiHost}/hype`);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        setInitialData(data);
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      }
    };

    fetchInitialData();
  }, []);

  const { data, error } = useSWR<TokenInfo>(
    ['https://api.hyperliquid.xyz/info', 'fetchHypeTokenInfo'],
    ([url]) => fetcher(url),
    {
      refreshInterval: 2_000,
    },
  );

  return {
    tokenInfo: data || initialData,
    error,
    isLoading: !error && !initialData && !data,
  };
};

export default useTokenInfo;
