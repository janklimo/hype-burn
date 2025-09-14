import { useEffect, useState } from 'react';

import { apiHost } from '@/constant/config';

export interface ValidatorNode {
  address: string;
  amount?: number;
  children?: ValidatorNode[];
}

export interface DelegationCount {
  validator: string;
  count: number;
}

export interface TotalStake {
  validator: string;
  total: number;
}

interface StakingSnapshotResponse {
  date: string;
  data: ValidatorNode;
  snapshot_dates: string[];
  delegations_count: DelegationCount[];
  total_stake: TotalStake[];
  filename: string | null;
}

const ENDPOINT = `${apiHost}/staking_snapshots/show_by_date`;

const useStakingSnapshot = (date: string | null) => {
  const [data, setData] = useState<ValidatorNode | null>(null);
  const [snapshotDate, setSnapshotDate] = useState<string>('');
  const [snapshotDates, setSnapshotDates] = useState<string[]>([]);
  const [delegationsCount, setDelegationsCount] = useState<DelegationCount[]>(
    [],
  );
  const [totalStake, setTotalStake] = useState<TotalStake[]>([]);
  const [filename, setFilename] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = ENDPOINT;
        if (date) {
          url = `${ENDPOINT}?date=${date}`;
        }

        const res = await fetch(url);
        const json: StakingSnapshotResponse = await res.json();
        setData(json.data);
        setSnapshotDate(json.date);
        setSnapshotDates(json.snapshot_dates);
        setDelegationsCount(json.delegations_count || []);
        setTotalStake(json.total_stake || []);
        setFilename(json.filename);
      } catch (e) {
        setData(null);
        setSnapshotDate('');
        setSnapshotDates([]);
        setDelegationsCount([]);
        setTotalStake([]);
        setFilename(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [date]);

  return {
    data,
    snapshotDate,
    snapshotDates,
    delegationsCount,
    totalStake,
    filename,
    isLoading,
  };
};

export default useStakingSnapshot;
