'use client';

import '@/lib/env';
import Head from 'next/head';
import Image from 'next/image';

import 'react-circular-progressbar/dist/styles.css';

import Peers from '@/components/Peers';
import Progress from '@/components/Progress';
import Stats from '@/components/Stats';
import TradeCallout from '@/components/TradeCallout';

import useWebSocketData from '@/app/hooks/use-websocket-data';

export default function HomePage() {
  const data = useWebSocketData();

  return (
    <main>
      <Head>
        <title>HYPE Burn</title>
      </Head>
      <section className='bg-hl-dark'>
        <div className='layout relative flex min-h-screen flex-col items-center justify-center py-4 text-center'>
          <h1 className='text-white text-5xl my-8'>
            <span className='font-serif font-extralight'>HYPE</span>
            <span className='font-serif italic font-thin'>Burn</span>
            <div className='w-8 inline-block ml-2'>
              <Image
                src='/images/fire.svg'
                width={64}
                height={64}
                priority
                alt='PURR'
              />
            </div>
          </h1>
          <div className='mb-4 h-96 w-80 md:h-[35rem] md:w-[70rem]'>
            <Progress data={data} />
          </div>
          <div className='mb-6 w-full sm:w-3/4'>
            <Stats data={data} />
          </div>
          <div className='my-4 w-full'>
            <Peers data={data} />
          </div>
          <TradeCallout />
        </div>
      </section>
    </main>
  );
}
