import { FC } from 'react';
import Marquee from 'react-fast-marquee';

import { downArrow, upArrow } from '@/lib/formatters';

import Skeleton from '@/components/Skeleton';

import useHypeData from '@/app/hooks/use-hype-data';
import useTokenInfo from '@/app/hooks/use-token-info';

const PriceChange: FC<{ change: number }> = ({ change }) => {
  if (change >= 1) {
    const percent = change - 1;

    return (
      <span className='text-accent'>
        {upArrow}{' '}
        {percent.toLocaleString(undefined, {
          style: 'percent',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    );
  } else {
    const percent = 1 - change;

    return (
      <span className='text-hl-red'>
        {downArrow}{' '}
        {percent.toLocaleString(undefined, {
          style: 'percent',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    );
  }
};

interface Props {
  data: ReturnType<typeof useHypeData>;
  tokenInfo: ReturnType<typeof useTokenInfo>['tokenInfo'];
}

const Stats: FC<Props> = ({ data, tokenInfo }) => {
  if (!data || !tokenInfo)
    return <Skeleton className='h-96 w-80 md:h-[35rem] md:w-[70rem]' />;

  const supply = parseFloat(tokenInfo.totalSupply);
  const burntAmount = 1_000_000_000 - supply;
  const markPrice = parseFloat(data.markPx);
  const previousDayPrice = parseFloat(data.prevDayPx);
  const volume = parseFloat(data.dayNtlVlm);
  const circulatingSupply = parseFloat(tokenInfo.circulatingSupply);

  return (
    <div className='bg-hl-light isolate p-2 mt-4 text-hlGray'>
      <Marquee pauseOnHover gradient gradientColor='#163832' gradientWidth={18}>
        {/* Burnt from trading */}
        <p className='text-hlGray text-sm mr-3'>Burn from trading fees:</p>
        <p className='text-accent text-sm font-mono'>
          {burntAmount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{' '}
          HYPE
        </p>
        <p className='text-gray-500 mx-3'>/</p>
        {/* Price */}
        <p className='text-hlGray text-sm mr-3'>Price:</p>
        <p className='text-accent text-sm font-mono'>
          {markPrice.toFixed(5)}{' '}
          <PriceChange change={markPrice / previousDayPrice} />
        </p>
        <p className='text-gray-500 mx-3'>/</p>
        {/* Volume */}
        <p className='text-hlGray text-sm mr-3'>Daily volume:</p>
        <p className='text-accent text-sm font-mono'>
          {volume.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
        <p className='text-gray-500 mx-3'>/</p>
        {/* Market cap */}
        <p className='text-hlGray text-sm mr-3'>Market cap:</p>
        <p className='text-accent text-sm font-mono'>
          {(markPrice * circulatingSupply).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
          })}
        </p>
        <p className='text-gray-500 mx-3'>/</p>
      </Marquee>
    </div>
  );
};

export default Stats;
