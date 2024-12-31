import useSWR from 'swr';

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
  const { data, error } = useSWR<TokenInfo>(
    ['https://api.hyperliquid.xyz/info', 'fetchHypeTokenInfo'],
    ([url]) => fetcher(url),
    {
      refreshInterval: 2_000,
    },
  );

  return {
    tokenInfo: data,
    error,
    isLoading: !error && !data,
  };
};

export default useTokenInfo;
