import useSWR from 'swr';

interface TokenInfo {
  totalSupply: string;
  circulatingSupply: string;
  nonCirculatingUserBalances: [string, string][];
}

const fetcher = (url: string) =>
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tokenId: '0x0d01dc56dcaaca66ad901c959b4011ec',
      type: 'tokenDetails',
    }),
  }).then((res) => res.json());

const useTokenInfo = () => {
  const { data, error } = useSWR<TokenInfo>(
    'https://api.hyperliquid.xyz/info',
    fetcher,
    { refreshInterval: 3_000 },
  );

  return {
    tokenInfo: data,
    error,
    isLoading: !error && !data,
  };
};

export default useTokenInfo;
