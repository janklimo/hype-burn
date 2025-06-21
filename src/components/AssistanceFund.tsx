import { FC, useEffect, useRef, useState } from 'react';

import RealTimePriceChart from '@/components/RealTimePriceChart';
import Skeleton from '@/components/Skeleton';

import { Balances } from '@/app/hooks/use-assistance-fund-balances';
import useHypeData from '@/app/hooks/use-hype-data';
import useOrderData from '@/app/hooks/use-order-data';

interface Props {
  data: ReturnType<typeof useHypeData>;
  balances: Balances;
}

const AssistanceFund: FC<Props> = ({ data, balances }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [accumulatedUSDC, setAccumulatedUSDC] = useState(0);
  const [accumulatedHYPE, setAccumulatedHYPE] = useState(0);
  const orders = useOrderData('0xfefefefefefefefefefefefefefefefefefefefe');

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
    const hypeOrders = orders.filter((order) => order.coin === '@107');
    const orderPrice =
      hypeOrders.length > 0 ? parseFloat(hypeOrders[0].limitPx) : 0;

    return (
      <>
        <div className='mb-8 flex flex-col gap-y-3'>
          <p className='text-hlGray text-sm'>
            The Assistance Fund (AF) currently holds{' '}
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
          {hypeOrders.length === 0 && (
            <p className='text-hlGray text-sm'>
              The AF currently has no open limit buy orders. The fund will begin
              placing orders once it accumulates over 10,000 USDC.
            </p>
          )}
          {hypeOrders.length > 0 && (
            <p className='text-hlGray text-sm'>
              The AF currently has an open limit buy order at{' '}
              <span className='font-bold text-accent'>
                ${parseFloat(hypeOrders[0].limitPx).toFixed(3)}
              </span>{' '}
              for{' '}
              <span className='font-bold text-accent'>
                {parseFloat(hypeOrders[0].sz).toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}{' '}
                HYPE
              </span>
              . The order value is{' '}
              <span className='font-bold text-accent'>
                {(parseFloat(hypeOrders[0].sz) * orderPrice).toLocaleString(
                  'en-US',
                  {
                    style: 'currency',
                    currency: 'USD',
                    maximumFractionDigits: 0,
                  },
                )}
              </span>
              .
            </p>
          )}
        </div>
        <RealTimePriceChart
          balances={balances}
          markPrice={markPrice}
          orderPrice={orderPrice}
        />
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
