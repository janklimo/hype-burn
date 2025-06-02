'use client';

import { FC } from 'react';

import TradeCallout from '@/components/TradeCallout';

import IndividualBuilders from '@/app/builders/IndividualBuilders';
import Top from '@/app/builders/Top';
import Totals from '@/app/builders/Totals';

const Builders: FC = () => {
  return (
    <main>
      <section className='bg-hl-dark p-3 md:p-4'>
        <div className='flex justify-center items-center flex-col mb-8'>
          <div className='relative w-full max-w-5xl'>
            <div id='charts' className='mt-8 mb-16 flex flex-col gap-8'>
              <Totals />
              <Top />
              <IndividualBuilders />
            </div>
            <TradeCallout />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Builders;
