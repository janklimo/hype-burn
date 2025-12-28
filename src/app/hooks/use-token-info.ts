import { useEffect, useState } from 'react';
import useSWR from 'swr';

import { apiHost } from '@/constant/config';

const ASSISTANCE_FUND_ADDRESS = '0xfefefefefefefefefefefefefefefefefefefefe';

const getAssistanceFundBalance = (balances: [string, string][]): number => {
  const entry = balances.find(
    ([address]) => address.toLowerCase() === ASSISTANCE_FUND_ADDRESS,
  );
  return entry ? parseFloat(entry[1]) : 0;
};

interface TokenInfo {
  totalSupply: string;
  circulatingSupply: string;
  futureEmissions: string;
  nonCirculatingUserBalances: [string, string][];
  assistanceFundBalance: number;
}

interface ServerTokenResponse {
  name: string;
  maxSupply: string;
  totalSupply: string;
  circulatingSupply: string;
  szDecimals: number;
  weiDecimals: number;
  midPx: string;
  markPx: string;
  prevDayPx: string;
  genesis: {
    userBalances: [string, string][];
  };
  deployer: string | null;
  deployGas: string;
  deployTime: string;
  seededUsdc: string;
  nonCirculatingUserBalances: [string, string][];
  futureEmissions: string;
}

async function fetcher(url: string): Promise<TokenInfo> {
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

  const serverResponse: ServerTokenResponse = await res.json();

  // Transform server response to only include TokenInfo fields to save memory
  return {
    totalSupply: serverResponse.totalSupply,
    circulatingSupply: serverResponse.circulatingSupply,
    futureEmissions: serverResponse.futureEmissions,
    nonCirculatingUserBalances: serverResponse.nonCirculatingUserBalances,
    assistanceFundBalance: getAssistanceFundBalance(
      serverResponse.nonCirculatingUserBalances,
    ),
  };
}

const useTokenInfo = () => {
  const [initialData, setInitialData] = useState<TokenInfo | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await fetch(`${apiHost}/hype`);
        if (!res.ok) throw new Error('Network response was not ok');
        const serverResponse: ServerTokenResponse = await res.json();

        const tokenInfo: TokenInfo = {
          totalSupply: serverResponse.totalSupply,
          circulatingSupply: serverResponse.circulatingSupply,
          futureEmissions: serverResponse.futureEmissions,
          nonCirculatingUserBalances: serverResponse.nonCirculatingUserBalances,
          assistanceFundBalance: getAssistanceFundBalance(
            serverResponse.nonCirculatingUserBalances,
          ),
        };

        setInitialData(tokenInfo);
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
