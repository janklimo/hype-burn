import { InformationCircleIcon } from '@heroicons/react/24/solid';
import NumberFlow from '@number-flow/react';
import { FC } from 'react';

import useTokenInfo from '@/app/hooks/use-token-info';
import { Tooltip } from '@/app/stats/Tooltip';

interface Props {
  tokenInfo: ReturnType<typeof useTokenInfo>['tokenInfo'];
  burntEVMBalance: number;
  assistanceFundBalance: number;
}

const ChartInner: FC<Props> = ({
  tokenInfo,
  burntEVMBalance,
  assistanceFundBalance,
}) => {
  if (!tokenInfo) return null;

  const totalSupply = parseFloat(tokenInfo.totalSupply);
  const adjustedSupply = totalSupply - burntEVMBalance - assistanceFundBalance;
  const burntFromTrading = 1_000_000_000 - totalSupply;

  const tooltipContent = (
    <div className='space-y-1'>
      <div className='flex justify-between'>
        <span className='font-bold mr-3 text-gray-300'>Initial Supply:</span>
        <span className='text-white font-bold'>1,000,000,000</span>
      </div>
      <div className='flex justify-between'>
        <span className='font-bold mr-3 text-gray-300'>Assistance Fund:</span>
        <span className='text-white'>
          -
          {assistanceFundBalance.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>
      <div className='flex justify-between'>
        <span className='font-bold mr-3 text-gray-300'>
          Burned Trading Fees:
        </span>
        <span className='text-white'>
          -
          {burntFromTrading.toLocaleString(undefined, {
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
        <span className='font-bold mr-3' style={{ color: '#fab866' }}>
          Total Burned:
        </span>
        <span style={{ color: '#fab866' }}>
          -
          {(
            assistanceFundBalance +
            burntFromTrading +
            burntEVMBalance
          ).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>
      <div className='flex justify-between font-bold mt-1'>
        <span className='font-bold mr-3 text-accent'>
          Current Total Supply:
        </span>
        <span className='text-accent'>
          {adjustedSupply.toLocaleString(undefined, {
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
            <span className='font-bold text-sm text-hlGray'>Total Supply</span>
            <InformationCircleIcon className='h-4 w-4 inline-block ml-1 text-white hover:text-beige-hover transition-colors duration-300' />
          </div>
        </Tooltip>
      </div>
      <div className='text-accent font-mono font-semibold text-lg md:text-2xl mt-1'>
        <NumberFlow
          value={adjustedSupply}
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
