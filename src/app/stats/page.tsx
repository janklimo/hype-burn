'use client';

import { FC, useEffect, useState } from 'react';

import TradeCallout from '@/components/TradeCallout';

import { apiHost } from '@/constant/config';

import { MarketStat } from '@/types/responses';

const Stats: FC = () => {
  const [data, setData] = useState<MarketStat[] | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      fetch(`${apiHost}/stats`)
        .then<MarketStat[]>((resp) => resp.json())
        .then((data) => setData(data));
    };

    fetchData();
  }, []);

  return (
    <main>
      <section className='bg-hl-dark p-3 md:p-4'>
        <div className='flex justify-center items-center flex-col mb-8'>
          <div className='relative w-full md:w-3/4 max-w-5xl'>
            {/* <DominanceChart data={data} /> */}
          </div>
        </div>
        <TradeCallout />
      </section>
    </main>
  );
};

export default Stats;
