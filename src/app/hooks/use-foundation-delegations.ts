import useSWR from 'swr';

import { FOUNDATION_STAKED_AMOUNT } from '@/utils/token';

interface Delegation {
  validator: string;
  amount: string;
  lockedUntilTimestamp: number;
}

const FOUNDATION_ADDRESSES = [
  '0x43e9abea1910387c4292bca4b94de81462f8a251',
  '0xd57ecca444a9acb7208d286be439de12dd09de5d',
];

async function foundationDelegationsFetcher(): Promise<number> {
  const promises = FOUNDATION_ADDRESSES.map(async (address) => {
    const res = await fetch('https://api.hyperliquid.xyz/info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'delegations',
        user: address,
      }),
    });

    if (!res.ok) {
      throw new Error(`Network response was not ok for address ${address}`);
    }

    const delegations: Delegation[] = await res.json();

    // Sum all amounts for this address
    return delegations.reduce((sum, delegation) => {
      return sum + parseFloat(delegation.amount);
    }, 0);
  });

  const results = await Promise.all(promises);

  // Sum all amounts from both addresses
  return results.reduce((total, addressTotal) => total + addressTotal, 0);
}

export const useFoundationDelegations = () => {
  const { data: foundationDelegations = FOUNDATION_STAKED_AMOUNT, error } =
    useSWR<number>(
      ['foundationDelegations'],
      () => foundationDelegationsFetcher(),
      {
        refreshInterval: 30_000, // Refresh every 30 seconds
        fallbackData: FOUNDATION_STAKED_AMOUNT,
      },
    );

  return {
    foundationDelegations: foundationDelegations as number,
    error,
    isLoading: !error && foundationDelegations === FOUNDATION_STAKED_AMOUNT,
  };
};
