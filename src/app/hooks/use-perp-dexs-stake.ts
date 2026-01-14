import useSWR from 'swr';

interface PerpDex {
  name: string;
  fullName: string;
  deployer: string;
  oracleUpdater: string | null;
  feeRecipient: string;
  assetToStreamingOiCap: [string, string][];
  subDeployers: [string, string[]][];
  deployerFeeScale: string;
  lastDeployerFeeScaleChangeTime: string;
}

const STAKE_PER_DEPLOYER = 500_000;

interface PerpDexsStakeResult {
  stake: number;
  dexNames: string[];
}

async function perpDexsStakeFetcher(): Promise<PerpDexsStakeResult> {
  const res = await fetch('https://api.hyperliquid.xyz/info', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'perpDexs',
    }),
  });

  if (!res.ok) {
    throw new Error('Network response was not ok');
  }

  const perpDexs: (PerpDex | null)[] = await res.json();

  // Filter DEXs where deployer is specified (not null/undefined)
  const activeDexs = perpDexs.filter(
    (dex): dex is PerpDex => dex !== null && !!dex.deployer,
  );

  return {
    stake: activeDexs.length * STAKE_PER_DEPLOYER,
    dexNames: activeDexs.map((dex) => dex.name),
  };
}

export const usePerpDexsStake = () => {
  const { data, error } = useSWR<PerpDexsStakeResult>(
    ['perpDexsStake'],
    () => perpDexsStakeFetcher(),
    {
      refreshInterval: 30_000, // Refresh every 30 seconds
      fallbackData: { stake: 0, dexNames: [] },
    },
  );

  return {
    perpDexsStake: data?.stake ?? 0,
    perpDexNames: data?.dexNames ?? [],
    error,
    isLoading: !error && data?.stake === 0,
  };
};
