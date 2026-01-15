'use client';

import {
  AgBarSeriesOptions,
  AgCartesianChartOptions,
} from 'ag-charts-community';
import { AgCharts } from 'ag-charts-react';
import { FC, useEffect, useState } from 'react';

import ChartSkeleton from '@/components/ChartSkeleton';
import UnderlineLink from '@/components/links/UnderlineLink';

const ENDPOINT = 'https://api.hyperliquid.xyz/info';

interface USDHResponse {
  isAligned: boolean;
  firstAlignedTime: number;
  evmMintedSupply: string;
  dailyAmountOwed: [string, string][];
  predictedRate: string;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);

const formatRate = (rate: string) => {
  const rateNum = parseFloat(rate) * 100;
  return `${rateNum.toFixed(3)}%`;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

const USDHChart: FC = () => {
  const [data, setData] = useState<USDHResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'alignedQuoteTokenInfo',
            token: 360,
          }),
        });
        const json: USDHResponse = await res.json();
        setData(json);
      } catch (e) {
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartData =
    data?.dailyAmountOwed.map(([date, amount]) => ({
      date: formatDate(date),
      amount: parseFloat(amount),
    })) || [];

  const totalSupply = data ? parseFloat(data.evmMintedSupply) : 0;
  const totalAmountOwed = data
    ? data.dailyAmountOwed.reduce(
        (sum, [, amount]) => sum + parseFloat(amount),
        0,
      )
    : 0;

  const options: AgCartesianChartOptions = {
    title: {
      text: 'Daily Amount Owed',
      spacing: 10,
    },
    subtitle: {
      text: 'Interest accrued by Hyperliquid on outstanding USDH balance',
      spacing: 30,
    },
    data: chartData,
    series: [
      {
        type: 'bar',
        xKey: 'date',
        yKey: 'amount',
        yName: 'Amount Owed',
        fill: '#9AFEFF',
        tooltip: {
          renderer: ({ datum }) => ({
            title: `<span style="color: #03251F;"><b>${datum.date}</b></span>`,
            content: `<span style="color: #03251F;">Amount: ${formatCurrency(datum.amount)}</span>`,
          }),
        },
      } as AgBarSeriesOptions,
    ],
    axes: [
      {
        type: 'category',
        position: 'bottom',
        title: { text: 'Date', color: '#9ca3af' },
        label: {
          rotation: -45,
          minSpacing: 5,
        },
      },
      {
        type: 'number',
        position: 'left',
        title: { text: 'Amount Owed (USD)', color: '#9ca3af' },
        label: {
          formatter: (params) => {
            return `$${params.value.toLocaleString()}`;
          },
        },
      },
    ],
    height: 400,
    background: { fill: '#0f1a1f' },
    padding: { top: 30, right: 25, bottom: 20, left: 25 },
    theme: 'ag-default-dark' as const,
  };

  if (isLoading) {
    return (
      <ChartSkeleton className='h-[560px]' message='Loading USDH data...' />
    );
  }

  return (
    <>
      <div className='p-4 pb-4 mb-4'>
        <div className='flex flex-wrap justify-center gap-6 md:gap-12 mb-8'>
          <div className='text-center'>
            <p className='text-gray-400 text-xs uppercase tracking-wide mb-1'>
              💰 Total Supply
            </p>
            <p className='font-bold text-accent text-sm'>
              {Math.round(totalSupply).toLocaleString()}
            </p>
          </div>
          <div className='text-center'>
            <p className='text-gray-400 text-xs uppercase tracking-wide mb-1'>
              📊 Total Amount Owed
            </p>
            <p className='font-bold text-accent text-sm'>
              {formatCurrency(totalAmountOwed)}
            </p>
          </div>
          <div className='text-center'>
            <p className='text-gray-400 text-xs uppercase tracking-wide mb-1'>
              📈 Risk-free Rate
            </p>
            <p className='font-bold text-accent text-sm'>
              {data ? formatRate(data.predictedRate) : '—'}
            </p>
          </div>
        </div>
        <p className='text-center text-xs text-gray-400'>
          For more details, visit the{' '}
          <UnderlineLink
            href='https://usdhstats.com/'
            openNewTab
            className='text-gray-400 hover:text-gray-300'
          >
            official USDH stats page.
          </UnderlineLink>
        </p>
      </div>

      <AgCharts options={options} />
    </>
  );
};

export default USDHChart;
