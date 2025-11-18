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

async function perpDexsStakeFetcher(): Promise<number> {
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

  // Count objects where deployer is specified (not null/undefined)
  const deployerCount = perpDexs.filter(
    (dex) => dex !== null && dex.deployer,
  ).length;

  return deployerCount * STAKE_PER_DEPLOYER;
}

export const usePerpDexsStake = () => {
  const { data: perpDexsStake = 0, error } = useSWR<number>(
    ['perpDexsStake'],
    () => perpDexsStakeFetcher(),
    {
      refreshInterval: 30_000, // Refresh every 30 seconds
      fallbackData: 0,
    },
  );

  return {
    perpDexsStake: perpDexsStake as number,
    error,
    isLoading: !error && perpDexsStake === 0,
  };
};
