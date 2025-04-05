import { FC } from 'react';

import { QuestionMarkTooltip } from './Tooltip';

interface SupplyBreakdownProps {
  circulatingSupply: number;
  assistanceFundBalance: number;
  stakedAmount: number;
  evmAmount: number;
}

export const SupplyBreakdown: FC<SupplyBreakdownProps> = ({
  circulatingSupply,
  assistanceFundBalance,
  stakedAmount,
  evmAmount,
}) => {
  const readyForSale =
    circulatingSupply - assistanceFundBalance - stakedAmount - evmAmount;

  const tooltipContent = (
    <div className='space-y-1'>
      <div className='flex justify-between'>
        <span className='font-bold mr-3 text-gray-300'>
          Circulating Supply:
        </span>
        <span className='text-white'>{circulatingSupply.toLocaleString()}</span>
      </div>
      <div className='flex justify-between'>
        <span className='font-bold mr-3 text-gray-300'>Assistance Fund:</span>
        <span className='text-white'>
          -{assistanceFundBalance.toLocaleString()}
        </span>
      </div>
      <div className='flex justify-between'>
        <span className='font-bold mr-3 text-gray-300'>
          Staked Circulating Supply:
        </span>
        <span className='text-white'>-{stakedAmount.toLocaleString()}</span>
      </div>
      {evmAmount > 0 && (
        <div className='flex justify-between'>
          <span className='font-bold mr-3 text-gray-300'>EVM Amount:</span>
          <span className='text-white'>-{evmAmount.toLocaleString()}</span>
        </div>
      )}
      <div className='flex justify-between font-bold mt-1'>
        <span className='font-bold mr-3 text-accent'>Ready for Sale:</span>
        <span className='text-accent'>{readyForSale.toLocaleString()}</span>
      </div>
    </div>
  );

  return <QuestionMarkTooltip content={tooltipContent} />;
};
