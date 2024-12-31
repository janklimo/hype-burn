'use client';

import '@/lib/env';
import Head from 'next/head';

import Chart from '@/components/Chart';
import ChartInner from '@/components/ChartInner';
import DidYouKnow from '@/components/DidYouKnow';
import Disclaimer from '@/components/Disclaimer';
import Headline from '@/components/Headline';
import Peers from '@/components/Peers';
import SaltSheet from '@/components/SaltSheet';
import Stats from '@/components/Stats';
import TradeCallout from '@/components/TradeCallout';

import { useAssistanceFundBalance } from '@/app/hooks/use-assistance-fund-balance';
import useHypeData from '@/app/hooks/use-hype-data';
import { useStakedBalance } from '@/app/hooks/use-staked-balance';
import useTokenInfo from '@/app/hooks/use-token-info';

export default function HomePage() {
  const data = useHypeData();
  const { tokenInfo } = useTokenInfo();
  const { assistanceFundBalance } = useAssistanceFundBalance();
  const { stakedBalance } = useStakedBalance();

  return (
    <main>
      <Head>
        <title>HYPE Burn Dashboard - Live Token Metrics & Market Data 🔥</title>
      </Head>
      <section className='bg-hl-dark'>
        <div className='layout relative flex min-h-screen flex-col items-center justify-center py-4 text-center'>
          <Headline />
          <div className='mb-4 h-[32rem] w-80 md:h-[35rem] md:w-[70rem] relative text-left'>
            <Chart
              tokenInfo={tokenInfo}
              assistanceFundBalance={assistanceFundBalance}
              stakedBalance={stakedBalance}
            />
            <ChartInner tokenInfo={tokenInfo} />
          </div>
          <div className='mb-6 w-full sm:w-3/4'>
            <Stats
              data={data}
              tokenInfo={tokenInfo}
              assistanceFundBalance={assistanceFundBalance}
            />
          </div>
          <div className='my-4 w-full'>
            <DidYouKnow data={data} tokenInfo={tokenInfo} />
          </div>
          <div className='mt-4 mb-6 w-full'>
            <SaltSheet data={data} />
          </div>
          <div className='my-4 w-full'>
            <Peers tokenInfo={tokenInfo} data={data} />
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
