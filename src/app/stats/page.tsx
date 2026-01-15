'use client';

import { FC } from 'react';

import PriceRevenueChart from '@/components/PriceRevenueChart';
import TradeCallout from '@/components/TradeCallout';

import Heatmap from './Heatmap';
import USDCChart from './USDCChart';
import USDHChart from './USDHChart';

const Stats: FC = () => {
  return (
    <main>
      <section className='bg-hl-dark p-3 md:p-4'>
        <div className='flex justify-center items-center flex-col mb-8'>
          <div className='relative w-full max-w-5xl'>
            <div className='mt-8 mb-12'>
              <h2 className='text-white text-lg mb-2 text-center'>
                USDH on Hyperliquid
              </h2>
              <USDHChart />
            </div>
            <div className='mt-8 mb-12'>
              <h2 className='text-white text-lg mb-2 text-center'>
                USDC on Hyperliquid
              </h2>
              <USDCChart />
            </div>
            <div className='mb-16'>
              <h2 className='text-white text-lg mb-4 text-center'>
                Price vs Revenue
              </h2>
              <PriceRevenueChart />
            </div>
            <Heatmap />
            <TradeCallout />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Stats;
