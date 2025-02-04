import { FC } from 'react';
import useSWR from 'swr';

import Skeleton from '@/components/Skeleton';

import useHypeData from '@/app/hooks/use-hype-data';
import useTokenInfo from '@/app/hooks/use-token-info';
import { apiHost } from '@/constant/config';
import { pointToHypeRatio } from '@/constant/constants';

import { LeaderboardData, LeaderboardRowData } from '@/types/responses';

const findFirstRankAboveBalance = (
  data: LeaderboardRowData[],
  balance: number,
): number => {
  const found = data.find((row) => balance > row.balance + row.balance_staked)!;
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
  data: ReturnType<typeof useHypeData>;
  tokenInfo: ReturnType<typeof useTokenInfo>['tokenInfo'];
}

const DidYouKnow: FC<Props> = ({ data, tokenInfo }) => {
  const { data: leaderboardData } = useSWR<LeaderboardData>(
    `${apiHost}/leaderboard?coin=hype`,
    (url: string) => fetch(url).then((res) => res.json()),
  );

  const renderBurntContent = () => {
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
        largest holder with{' '}
        <span className='font-bold text-accent'>
          {burntAmount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{' '}
          HYPE
        </span>{' '}
        worth{' '}
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

  const renderAirdropContent = () => {
    if (!data) {
      return <Skeleton className='h-6 mb-3 w-full max-w-xl mx-auto' />;
    }

    const markPrice = parseFloat(data.markPx);
    const pointValue = markPrice * pointToHypeRatio;

    return (
      <p className='text-hlGray text-sm mb-3'>
        The airdropped amount is currently valued at{' '}
        <span className='font-bold text-accent'>
          {((markPrice * 310_000_000) / 1_000_000_000).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
          B
        </span>
        , making each point worth{' '}
        <span className='font-bold text-accent'>
          {pointValue.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
        .
        <br /> HYPE needs to do a{' '}
        <span className='font-bold text-accent'>
          {(800 / pointValue).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
          x
        </span>{' '}
        from here to fulfill the prophecy of $800/point.
      </p>
    );
  };

  const renderContent = () => {
    return (
      <div>
        {renderBurntContent()}
        {renderAirdropContent()}
      </div>
    );
  };

  return (
    <div>
      <h2 className='text-white text-base mb-2'>💡 Did you know?</h2>
      {renderContent()}
    </div>
  );
};

export default DidYouKnow;
