'use client';

import { useEffect, useState } from 'react';

interface ValidatorSummary {
  validator: string;
  name: string;
  stake: number;
}

interface Delegation {
  validator: string;
  amount: string;
}

export interface DelegationRow {
  name: string;
  foundation: number;
  labs: number;
  community: number;
  total: number;
}

const LABS_ADDRESS = '0x43e9abea1910387c4292bca4b94de81462f8a251';
const FOUNDATION_ADDRESS = '0xd57ecca444a9acb7208d286be439de12dd09de5d';
const STAKE_DECIMALS = 1e8;

const fetchDelegations = async (user: string): Promise<Delegation[]> => {
  const response = await fetch('https://api.hyperliquid.xyz/info', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'delegations', user }),
  });
  return response.json();
};

const useDelegationsTable = () => {
  const [rows, setRows] = useState<DelegationRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [validators, labsDelegations, foundationDelegations] =
          await Promise.all([
            fetch('https://api.hyperliquid.xyz/info', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ type: 'validatorSummaries' }),
            }).then((r) => r.json()) as Promise<ValidatorSummary[]>,
            fetchDelegations(LABS_ADDRESS),
            fetchDelegations(FOUNDATION_ADDRESS),
          ]);

        const labsMap = new Map<string, number>();
        labsDelegations.forEach((d) =>
          labsMap.set(d.validator, parseFloat(d.amount)),
        );

        const foundationMap = new Map<string, number>();
        foundationDelegations.forEach((d) =>
          foundationMap.set(d.validator, parseFloat(d.amount)),
        );

        const tableRows: DelegationRow[] = validators
          .sort((a, b) => b.stake - a.stake)
          .map((v) => {
            const stakeHype = v.stake / STAKE_DECIMALS;
            const labs = labsMap.get(v.validator) || 0;
            const foundation = foundationMap.get(v.validator) || 0;
            const community = stakeHype - labs - foundation;

            return {
              name: v.name || v.validator,
              foundation,
              labs,
              community,
              total: stakeHype,
            };
          });

        setRows(tableRows);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { rows, isLoading };
};

export default useDelegationsTable;
