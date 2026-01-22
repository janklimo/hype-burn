import { FC } from 'react';

import { QuestionMarkTooltip } from './Tooltip';

interface SupplyBreakdownProps {
  circulatingSupply: number;
  stakedAmount: number;
  burntEVMAmount: number;
}

export const SupplyBreakdown: FC<SupplyBreakdownProps> = ({
  circulatingSupply,
  stakedAmount,
  burntEVMAmount,
}) => {
  const readyForSale = circulatingSupply - stakedAmount - burntEVMAmount;

  const tooltipContent = (
    <div className='space-y-1'>
      <div className='flex justify-between'>
        <span className='font-bold mr-3 text-gray-300'>
          Circulating Supply:
        </span>
        <span className='text-white'>{circulatingSupply.toLocaleString()}</span>
      </div>
      <div className='flex justify-between'>
        <span className='font-bold mr-3 text-gray-300'>
          Staked Circulating Supply:
        </span>
        <span className='text-white'>-{stakedAmount.toLocaleString()}</span>
      </div>
      <div className='flex justify-between'>
        <span className='font-bold mr-3 text-gray-300'>Burned (HyperEVM):</span>
        <span className='text-white'>
          -{burntEVMAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </span>
      </div>
      <div className='flex justify-between font-bold mt-1'>
        <span className='font-bold mr-3 text-accent'>Ready for Sale:</span>
        <span className='text-accent'>
          {readyForSale.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );

  return <QuestionMarkTooltip content={tooltipContent} />;
};
