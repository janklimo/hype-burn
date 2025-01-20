import dynamic from 'next/dynamic';
import { FC, useEffect, useRef, useState } from 'react';

const AssistanceFundChart = dynamic(
  () => import('@/components/AssistanceFundChart'),
  { ssr: false },
);

import Skeleton from '@/components/Skeleton';

import { Balances } from '@/app/hooks/use-assistance-fund-balances';
import useHypeData from '@/app/hooks/use-hype-data';

interface Props {
  data: ReturnType<typeof useHypeData>;
  balances: Balances;
}

const AssistanceFund: FC<Props> = ({ data, balances }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [accumulatedUSDC, setAccumulatedUSDC] = useState(0);
  const [accumulatedHYPE, setAccumulatedHYPE] = useState(0);

  const prevBalances = useRef<Balances | null>(null);
  const initialBalances = useRef<Balances | null>(null);

  useEffect(() => {
    if (!initialBalances.current && balances.USDC > 0) {
      initialBalances.current = balances;
      prevBalances.current = balances;
      return;
    }

    if (!prevBalances.current) return;

    if (balances.USDC > prevBalances.current.USDC) {
      const usdcDiff = balances.USDC - prevBalances.current.USDC;
      setAccumulatedUSDC((prev) => prev + usdcDiff);
    }

    if (balances.HYPE > prevBalances.current.HYPE) {
      const hypeDiff = balances.HYPE - prevBalances.current.HYPE;
      setAccumulatedHYPE((prev) => prev + hypeDiff);
    }

    prevBalances.current = balances;
  }, [balances]);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatElapsedTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes === 0) {
      return `${remainingSeconds}s`;
    }
    return `${minutes}m ${remainingSeconds}s`;
  };

  const renderContent = () => {
    if (!data || !balances.HYPE) {
      return <Skeleton className='h-6 mb-3 w-full max-w-xl mx-auto' />;
    }

    const markPrice = parseFloat(data.markPx);
    const fundValue = markPrice * balances.HYPE;

    return (
      <>
        <div className='mb-8 flex flex-col gap-y-3'>
          <p className='text-hlGray text-sm'>
            The Assistance Fund currently holds{' '}
            <span className='font-bold text-accent'>
              {balances.HYPE.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{' '}
              HYPE
            </span>{' '}
            worth{' '}
            <span className='font-bold text-accent'>
              {fundValue.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
              })}
            </span>
          </p>
          <p className='text-hlGray text-sm'>
            During your{' '}
            <span className='font-bold text-accent'>
              {formatElapsedTime(elapsedTime)}
            </span>{' '}
            on this page, the fund has collected{' '}
            <span className='font-bold text-accent'>
              {accumulatedUSDC.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>{' '}
            and bought{' '}
            <span className='font-bold text-accent'>
              {accumulatedHYPE.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{' '}
              HYPE
            </span>
          </p>
        </div>
        <AssistanceFundChart balances={balances} />
      </>
    );
  };

  return (
    <div>
      <h2 className='text-white text-base mb-2'>🏦 Assistance Fund</h2>
      {renderContent()}
    </div>
  );
};

export default AssistanceFund;
