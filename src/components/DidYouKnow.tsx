import { FC } from 'react';
import useSWR from 'swr';

import Skeleton from '@/components/Skeleton';

import useTokenInfo from '@/app/hooks/use-token-info';
import useWebSocketData from '@/app/hooks/use-websocket-data';
import { apiHost } from '@/constant/config';

import { LeaderboardData, LeaderboardRowData } from '@/types/responses';

interface HypeData {
  totalSupply: string;
  markPx: string;
}

const findFirstRankAboveBalance = (
  data: LeaderboardRowData[],
  balance: number,
): number => {
  const found = data.find((row) => balance > row.purr_balance)!;
  return found.rank;
};

const toOrdinal = (n: number): string => {
  const suffixes: { [key: number]: string } = {
    1: 'st',
    2: 'nd',
    3: 'rd',
  };
  if (n % 100 >= 11 && n % 100 <= 13) {
    return `${n}th`;
  }
  return `${n}${suffixes[n % 10] || 'th'}`;
};

interface Props {
  data: ReturnType<typeof useWebSocketData>;
  tokenInfo: ReturnType<typeof useTokenInfo>['tokenInfo'];
}

const DidYouKnow: FC<Props> = ({ data, tokenInfo }) => {
  const { data: leaderboardData } = useSWR<LeaderboardData>(
    `${apiHost}/leaderboard`,
    (url: string) => fetch(url).then((res) => res.json()),
  );

  const renderBurnedContent = () => {
    if (!data || !tokenInfo || !leaderboardData?.rows.length) {
      return <Skeleton className='h-6 mb-3 w-full max-w-xl mx-auto' />;
    }

    const supply = parseFloat(tokenInfo.totalSupply);
    const burntAmount = 1_000_000_000 - supply;
    const markPrice = parseFloat(data.markPx);

    return (
      <p className='text-hlGray text-sm mb-3'>
        The total amount of burned HYPE tokens would rank as the{' '}
        <span className='font-bold text-accent'>
          {toOrdinal(
            findFirstRankAboveBalance(leaderboardData.rows, burntAmount),
          )}
        </span>{' '}
        largest holder worth{' '}
        <span className='font-bold text-accent'>
          {(markPrice * burntAmount).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
          })}
        </span>
      </p>
    );
  };

  return (
    <div>
      <h2 className='text-white text-base mb-2'>💡 Did you know?</h2>
      {renderBurnedContent()}
    </div>
  );
};

export default DidYouKnow;
