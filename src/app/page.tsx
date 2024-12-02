'use client';

import '@/lib/env';
import Head from 'next/head';

import 'react-circular-progressbar/dist/styles.css';

import Chart from '@/components/Chart';
import Disclaimer from '@/components/Disclaimer';
import Headline from '@/components/Headline';
import Peers from '@/components/Peers';
import Stats from '@/components/Stats';
import TradeCallout from '@/components/TradeCallout';

import useHypeData from '@/app/hooks/use-hype-data';
import useTokenInfo from '@/app/hooks/use-token-info';

export default function HomePage() {
  const data = useHypeData();
  const { tokenInfo } = useTokenInfo();

  return (
    <main>
      <Head>
        <title>HYPE Burn</title>
      </Head>
      <section className='bg-hl-dark'>
        <div className='layout relative flex min-h-screen flex-col items-center justify-center py-4 text-center'>
          <Headline />
          <div className='mb-4 h-96 w-80 md:h-[35rem] md:w-[70rem] relative'>
            <Chart tokenInfo={tokenInfo} />
            {/* <span className='absolute top-1/2 left-1/2 text-white -translate-x-1/2 -translate-y-1/2'>
              hi there
            </span> */}
          </div>
          <div className='mb-6 w-full sm:w-3/4'>
            <Stats data={data} tokenInfo={tokenInfo} />
          </div>
          <div className='my-4 w-full'>
            <Peers data={data} />
          </div>
          <TradeCallout />
          <div className='mt-6'>
            <Disclaimer />
          </div>
        </div>
      </section>
    </main>
  );
}
