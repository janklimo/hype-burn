import { FC } from 'react';
import useSWR from 'swr';

import UnderlineLink from '@/components/links/UnderlineLink';
import Skeleton from '@/components/Skeleton';

import useHypeData from '@/app/hooks/use-hype-data';
import useTokenInfo from '@/app/hooks/use-token-info';
import { apiHost } from '@/constant/config';
import { pointToHypeRatio } from '@/constant/constants';

import { LeaderboardData, LeaderboardRowData } from '@/types/responses';

interface OpenSeaCollectionStats {
  volume: number;
  sales: number;
  num_owners: number;
  market_cap: number;
  floor_price: number;
  floor_price_symbol: string;
  average_price: number;
}

const findFirstRankAboveBalance = (
  data: LeaderboardRowData[],
  balance: number,
): number => {
  const found = data.find((row) => balance > row.balance + row.balance_staked);
  return found?.rank ?? data.length + 1;
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
  burntEVMBalance: number;
  assistanceFundBalance: number;
}

const DidYouKnow: FC<Props> = ({
  data,
  tokenInfo,
  burntEVMBalance,
  assistanceFundBalance,
}) => {
  const { data: leaderboardData } = useSWR<LeaderboardData>(
    `${apiHost}/leaderboard?coin=hype`,
    (url: string) => fetch(url).then((res) => res.json()),
  );

  const { data: nftData } = useSWR<{ total: OpenSeaCollectionStats }>(
    'opensea-hypurr-stats',
    () =>
      fetch('https://api.opensea.io/api/v2/collections/hypurr-hyperevm/stats', {
        headers: {
          accept: 'application/json',
          'x-api-key': '70033b83304d4167b752228846b1ae36',
        },
      }).then((res) => res.json()),
  );

  const renderBurntContent = () => {
    if (!data || !tokenInfo || !leaderboardData?.rows.length) {
      return <Skeleton className='h-6 w-full max-w-xl mx-auto' />;
    }

    const supply = parseFloat(tokenInfo.totalSupply);
    const burntAmount =
      1_000_000_000 - supply + burntEVMBalance + assistanceFundBalance;
    const markPrice = parseFloat(data.markPx);

    return (
      <p className='text-hlGray text-sm'>
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
      return <Skeleton className='h-6 w-full max-w-xl mx-auto' />;
    }

    const markPrice = parseFloat(data.markPx);
    const pointValue = markPrice * pointToHypeRatio;

    return (
      <p className='text-hlGray text-sm'>
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

  const renderNftContent = () => {
    if (!data || !nftData?.total) {
      return <Skeleton className='h-6 w-full max-w-xl mx-auto' />;
    }

    const markPrice = parseFloat(data.markPx);
    const floorPriceHype = nftData.total.floor_price;
    const floorPriceUsd = floorPriceHype * markPrice;
    const totalNfts = 4_600;
    const totalCollectionValueUsd = totalNfts * floorPriceUsd;

    return (
      <p className='text-hlGray text-sm'>
        At the floor price of{' '}
        <span className='font-bold text-accent'>
          {floorPriceHype.toLocaleString()} HYPE
        </span>{' '}
        (
        <span className='font-bold text-accent'>
          {floorPriceUsd.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
          })}
        </span>
        ) the{' '}
        <UnderlineLink
          href='https://opensea.io/collection/hypurr-hyperevm'
          className='text-white'
        >
          Hypurr NFT collection
        </UnderlineLink>{' '}
        airdropped to the community is worth{' '}
        <span className='font-bold text-accent'>
          {(totalCollectionValueUsd / 1_000_000).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          })}
          M
        </span>
        .
      </p>
    );
  };

  const renderContent = () => {
    return (
      <div className='flex flex-col gap-3'>
        {renderBurntContent()}
        {renderAirdropContent()}
        {renderNftContent()}
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
