import { InformationCircleIcon } from '@heroicons/react/24/solid';
import NumberFlow from '@number-flow/react';
import { FC } from 'react';

import useTokenInfo from '@/app/hooks/use-token-info';
import { Tooltip } from '@/app/stats/Tooltip';

interface Props {
  tokenInfo: ReturnType<typeof useTokenInfo>['tokenInfo'];
  burntEVMBalance: number;
}

const ChartInner: FC<Props> = ({ tokenInfo, burntEVMBalance }) => {
  if (!tokenInfo) return null;

  const circulatingSupply = parseFloat(tokenInfo.circulatingSupply);
  const adjustedCirculatingSupply = circulatingSupply - burntEVMBalance;

  const tooltipContent = (
    <div className='space-y-1'>
      <div className='flex justify-between'>
        <span className='font-bold mr-3 text-gray-300'>
          Circulating Supply:
        </span>
        <span className='text-white font-bold'>
          {circulatingSupply.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>
      <div className='flex justify-between'>
        <span className='font-bold mr-3 text-gray-300'>Burned (HyperEVM):</span>
        <span className='text-white'>
          -
          {burntEVMBalance.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>
      <div className='flex justify-between font-bold mt-1 pt-1 border-t border-gray-600'>
        <span className='font-bold mr-3 text-accent'>
          Adjusted Circulating:
        </span>
        <span className='text-accent'>
          {adjustedCirculatingSupply.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>
    </div>
  );

  return (
    <div className='absolute text-center top-1/2 left-1/2 text-white -translate-x-1/2 -translate-y-1/2 -mt-24 md:-mt-10'>
      <div className='flex items-center justify-center'>
        <Tooltip content={tooltipContent}>
          <div className='flex items-center'>
            <span className='font-bold text-sm text-hlGray'>
              Circulating Supply
            </span>
            <InformationCircleIcon className='h-4 w-4 inline-block ml-1 text-white hover:text-beige-hover transition-colors duration-300' />
          </div>
        </Tooltip>
      </div>
      <div className='text-accent font-mono font-semibold text-lg md:text-2xl mt-1'>
        <NumberFlow
          value={adjustedCirculatingSupply}
          format={{
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }}
          spinTiming={{ duration: 1500 }}
        />
      </div>
      <p className='font-mono text-md md:text-xl text-accent'>HYPE</p>
    </div>
  );
};

export default ChartInner;
