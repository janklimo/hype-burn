'use client';

import { FC } from 'react';

import TradeCallout from '@/components/TradeCallout';

import Heatmap from './Heatmap';

const Stats: FC = () => {
  return (
    <main>
      <section className='bg-hl-dark p-3 md:p-4'>
        <div className='flex justify-center items-center flex-col mb-8'>
          <div className='relative w-full max-w-5xl'>
            <Heatmap />
            <TradeCallout />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Stats;
