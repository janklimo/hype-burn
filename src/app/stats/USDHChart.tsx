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

// Historical data (USD values) - temporary until API endpoint is updated
const HISTORICAL_DATA: [string, number][] = [
  ['2025-11-23', 1485.13],
  ['2025-11-24', 1498.23168859],
  ['2025-11-25', 1532.27266462],
  ['2025-11-26', 1661.75550397],
  ['2025-11-27', 2189.79615847],
  ['2025-11-28', 2707.89249451],
  ['2025-11-29', 2823.02139399],
  ['2025-11-30', 2839.56240151],
  ['2025-12-01', 2851.15108255],
  ['2025-12-02', 2863.3620939],
  ['2025-12-02', 2863.3620939],
  ['2025-12-03', 2788.02732407],
  ['2025-12-04', 2719.56528795],
  ['2025-12-05', 2600.6331015],
  ['2025-12-06', 2575.86481001],
  ['2025-12-07', 2641.932797],
  ['2025-12-08', 2678.34388456],
  ['2025-12-09', 2629.61042341],
  ['2025-12-10', 2732.44322477],
  ['2025-12-11', 2763.26554654],
  ['2025-12-12', 2949.00267787],
  ['2025-12-13', 3183.72583834],
  ['2025-12-14', 3183.72574309],
  ['2025-12-15', 3201.8252578],
  ['2025-12-16', 3121.95023143],
  ['2025-12-17', 2922.6490621],
  ['2025-12-18', 2739.25415078],
  ['2025-12-19', 2891.38075867],
  ['2025-12-20', 2927.24121156],
  ['2025-12-21', 2927.60637397],
  ['2025-12-22', 2942.25735216],
  ['2025-12-23', 3017.45746753],
  ['2025-12-24', 3069.87594758],
  ['2025-12-25', 3153.91530513],
  ['2025-12-26', 3186.11091676],
  ['2025-12-27', 3201.48824715],
  ['2025-12-28', 3201.48842825],
  ['2025-12-29', 3197.46190218],
  ['2025-12-30', 3101.80269721],
  ['2025-12-31', 2952.2494697],
  ['2026-01-01', 2811.80918251],
  ['2026-01-02', 2806.50125664],
  ['2026-01-03', 2666.49346047],
  ['2026-01-04', 2665.82017862],
  ['2026-01-05', 2665.78791446],
  ['2026-01-06', 2653.46324368],
  ['2026-01-07', 2772.18282755],
  ['2026-01-08', 2878.96223405],
  ['2026-01-09', 2896.95834145],
  ['2026-01-10', 2889.11725198],
  ['2026-01-11', 2889.12088185],
  ['2026-01-12', 2976.3324621],
  ['2026-01-13', 3254.71342273],
  ['2026-01-14', 3364.90716303],
  ['2026-01-15', 1223.36862723],
];

// Merge historical data with API data, preferring API data for overlapping dates
const mergeWithHistoricalData = (
  apiData: [string, string][],
): [string, number][] => {
  const firstApiDate = apiData.length > 0 ? apiData[0][0] : null;

  // Get historical entries that come before the first API date
  const historicalEntries = firstApiDate
    ? HISTORICAL_DATA.filter(([date]) => date < firstApiDate)
    : HISTORICAL_DATA;

  // Convert API string values to numbers
  const convertedApi: [string, number][] = apiData.map(([date, amount]) => [
    date,
    parseFloat(amount),
  ]);

  return [...historicalEntries, ...convertedApi];
};

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

  // Merge API data with historical data
  const mergedData = data ? mergeWithHistoricalData(data.dailyAmountOwed) : [];

  const chartData = mergedData.map(([date, amount]) => ({
    date: formatDate(date),
    amount,
  }));

  const totalSupply = data ? parseFloat(data.evmMintedSupply) : 0;
  const totalAmountOwed = mergedData.reduce(
    (sum, [, amount]) => sum + amount,
    0,
  );

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
